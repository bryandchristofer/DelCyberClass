const express = require("express");
const { Client } = require("ssh2");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_praktikum",
};
const pool = mysql.createPool(dbConfig);

const machines = {
  machine1: {
    host: "192.168.210.120",
    username: "user-ssh",
    privateKeyPath: "C:/Users/TUF/.ssh/id_rsa",
  },
  machine2: {
    host: "192.168.210.191",
    username: "ismail",
    privateKeyPath: "C:/Users/TUF/.ssh/id_rsa",
  },
};

async function runQuery(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// Endpoint untuk menjalankan perintah dari web-based shell
app.post("/execute-command", async (req, res) => {
  const { command, praktikumId } = req.body;

  if (!command || !praktikumId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const praktikum = await runQuery("SELECT * FROM praktikum WHERE id = ?", [
      praktikumId,
    ]);
    if (praktikum.length === 0) {
      return res.status(404).send("Praktikum not found");
    }

    const { imageName, targetMachine } = praktikum[0];
    const machineConfig = machines[targetMachine];

    const ssh = new Client();
    let isResponseSent = false;

    ssh
      .on("ready", () => {
        console.log("SSH Client :: ready");
        ssh.exec(
          `docker ps -q --filter "ancestor=${imageName}"`,
          (err, stream) => {
            if (err) {
              if (!isResponseSent) {
                res.status(500).send("SSH command execution failed");
                isResponseSent = true;
              }
              ssh.end();
              return;
            }

            let containerId = "";

            stream
              .on("data", (data) => {
                containerId += data.toString().trim();
              })
              .on("close", (code, signal) => {
                if (code !== 0 || !containerId) {
                  if (!isResponseSent) {
                    res
                      .status(500)
                      .send("Failed to find the running container");
                    isResponseSent = true;
                  }
                  ssh.end();
                  return;
                }

                ssh.exec(
                  `docker exec ${containerId} ${command}`,
                  (err, stream) => {
                    if (err) {
                      if (!isResponseSent) {
                        res.status(500).send("SSH command execution failed");
                        isResponseSent = true;
                      }
                      ssh.end();
                      return;
                    }

                    let output = "";

                    stream
                      .on("close", (code, signal) => {
                        ssh.end();
                        if (!isResponseSent) {
                          res.json({ output });
                          isResponseSent = true;
                        }
                      })
                      .on("data", (data) => {
                        output += data.toString();
                      })
                      .stderr.on("data", (data) => {
                        output += data.toString();
                      });
                  }
                );
              });
          }
        );
      })
      .on("error", (error) => {
        console.error("SSH Client :: error", error);
        if (!isResponseSent) {
          res.status(500).send("SSH connection error");
          isResponseSent = true;
        }
      })
      .on("end", () => {
        console.log("SSH Client :: end");
      })
      .on("close", () => {
        console.log("SSH Client :: close");
      })
      .connect({
        host: machineConfig.host,
        username: machineConfig.username,
        privateKey: fs.readFileSync(machineConfig.privateKeyPath),
      });
  } catch (error) {
    console.error("Failed to execute command:", error);
    if (!isResponseSent) {
      res.status(500).send("Error executing command");
    }
  }
});

app.get("/praktikum-names", async (req, res) => {
  try {
    const names = await runQuery("SELECT title FROM praktikum");
    res.json(names.map((prak) => prak.title));
  } catch (error) {
    console.error("Failed to fetch praktikum names:", error);
    res.status(500).send("Error fetching praktikum names");
  }
});

app.post("/deploy", async (req, res) => {
  const { title, imageName, targetMachine, description } = req.body;

  if (!title || !imageName || !targetMachine || !description) {
    return res.status(400).send("Missing required fields");
  }

  // Check if the praktikum name already exists
  const existing = await runQuery("SELECT id FROM praktikum WHERE title = ?", [
    title,
  ]);
  if (existing.length > 0) {
    return res.status(400).send("Praktikum name must be unique");
  }

  const slug = slugify(title, { lower: true, strict: true });
  const machineConfig = machines[targetMachine];
  if (!machineConfig) {
    return res.status(400).send("Invalid machine configuration");
  }

  try {
    const result = await runQuery(
      "INSERT INTO praktikum (title, slug, imageName, targetMachine, description) VALUES (?, ?, ?, ?, ?)",
      [title, slug, imageName, targetMachine, description]
    );

    const ssh = new Client();
    let isResponseSent = false;

    ssh
      .on("ready", () => {
        console.log("SSH Client :: ready");
        ssh.exec(
          `docker pull ${imageName} && docker run -d ${imageName}`,
          (err, stream) => {
            if (err) {
              if (!isResponseSent) {
                res.status(500).send("SSH command execution failed");
                isResponseSent = true;
              }
              ssh.end();
              return;
            }

            let output = "";

            stream
              .on("close", (code, signal) => {
                console.log(
                  "Stream :: close :: code: " + code + ", signal: " + signal
                );
                ssh.end();
                if (!isResponseSent) {
                  if (code === 0) {
                    res.json({
                      message: "Container deployed successfully",
                      deploymentId: result.insertId,
                    });
                  } else {
                    res.status(500).send("Failed to deploy container");
                  }
                  isResponseSent = true;
                }
              })
              .on("data", (data) => {
                output += data.toString();
                console.log("STDOUT: " + data);
              })
              .stderr.on("data", (data) => {
                output += data.toString();
                console.error("STDERR: " + data);
              });
          }
        );
      })
      .on("error", (error) => {
        console.error("SSH Client :: error", error);
        if (!isResponseSent) {
          res.status(500).send("SSH connection error");
          isResponseSent = true;
        }
      })
      .on("end", () => {
        console.log("SSH Client :: end");
      })
      .on("close", () => {
        console.log("SSH Client :: close");
      })
      .connect({
        host: machineConfig.host,
        username: machineConfig.username,
        privateKey: fs.readFileSync(machineConfig.privateKeyPath),
      });
  } catch (error) {
    console.error("Database or SSH Error:", error);
    if (!isResponseSent) {
      res.status(500).send("Failed to initiate deployment");
    }
  }
});

app.get("/praktikums", async (req, res) => {
  try {
    const results = await runQuery("SELECT * FROM praktikum");
    res.json(results);
  } catch (error) {
    console.error("Failed to fetch praktikums:", error);
    res.status(500).send("Error fetching praktikum data");
  }
});

app.get("/praktikum/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const results = await runQuery("SELECT * FROM praktikum WHERE slug = ?", [
      slug,
    ]);
    if (results.length === 0) {
      return res.status(404).send("Praktikum not found");
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Failed to fetch praktikum:", error);
    res.status(500).send("Error fetching praktikum data");
  }
});

app.put("/praktikums/:id", async (req, res) => {
  const { id } = req.params;
  const { title, imageName, targetMachine, description } = req.body;

  if (!title || !imageName || !targetMachine || !description) {
    return res.status(400).send("Missing required fields");
  }

  const slug = slugify(title, { lower: true, strict: true });
  try {
    const result = await runQuery(
      "UPDATE praktikum SET title = ?, slug = ?, imageName = ?, targetMachine = ?, description = ? WHERE id = ?",
      [title, slug, imageName, targetMachine, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Praktikum not found");
    }

    res.json({ message: "Praktikum updated successfully" });
  } catch (error) {
    console.error("Failed to update praktikum:", error);
    res.status(500).send("Error updating praktikum");
  }
});

app.delete("/praktikums/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const praktikum = await runQuery("SELECT * FROM praktikum WHERE id = ?", [
      id,
    ]);
    if (praktikum.length === 0) {
      return res.status(404).send("Praktikum not found");
    }

    const { imageName, targetMachine } = praktikum[0];
    const machineConfig = machines[targetMachine];

    const ssh = new Client();
    let isResponseSent = false;

    ssh
      .on("ready", () => {
        console.log("SSH Client :: ready");
        ssh.exec(
          `for /F "tokens=*" %i in ('docker ps -q --filter "ancestor=${imageName}"') do docker stop %i && docker rm %i && docker rmi ${imageName}`,
          (err, stream) => {
            if (err) {
              if (!isResponseSent) {
                res.status(500).send("SSH command execution failed");
                isResponseSent = true;
              }
              ssh.end();
              return;
            }
            stream
              .on("close", async (code, signal) => {
                console.log(
                  "Stream :: close :: code: " + code + ", signal: " + signal
                );
                ssh.end();

                try {
                  const result = await runQuery(
                    "DELETE FROM praktikum WHERE id = ?",
                    [id]
                  );
                  if (result.affectedRows === 0) {
                    if (!isResponseSent) {
                      res.status(404).send("Praktikum not found");
                      isResponseSent = true;
                    }
                  } else {
                    if (!isResponseSent) {
                      res.json({
                        message:
                          "Praktikum and Docker container and image deleted successfully",
                      });
                      isResponseSent = true;
                    }
                  }
                } catch (error) {
                  console.error("Failed to delete praktikum:", error);
                  if (!isResponseSent) {
                    res.status(500).send("Error deleting praktikum");
                    isResponseSent = true;
                  }
                }
              })
              .on("data", (data) => {
                console.log("STDOUT: " + data);
              })
              .stderr.on("data", (data) => {
                console.error("STDERR: " + data);
              });
          }
        );
      })
      .on("error", (error) => {
        console.error("SSH Client :: error", error);
        if (!isResponseSent) {
          res.status(500).send("SSH connection error");
          isResponseSent = true;
        }
      })
      .on("end", () => {
        console.log("SSH Client :: end");
      })
      .on("close", () => {
        console.log("SSH Client :: close");
      })
      .connect({
        host: machineConfig.host,
        username: machineConfig.username,
        privateKey: fs.readFileSync(machineConfig.privateKeyPath),
      });
  } catch (error) {
    console.error("Failed to delete praktikum:", error);
    if (!isResponseSent) {
      res.status(500).send("Error deleting praktikum");
      isResponseSent = true;
    }
  }
});

const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
