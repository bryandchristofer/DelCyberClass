const express = require("express");
const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const tar = require("tar-fs");
const cors = require("cors");

const app = express();
const docker = new Docker({
  host: "127.0.0.1", // Connect to localhost
  port: 2375, // Docker API port via SSH tunnel
});

app.use(express.json());
app.use(cors());

const imageName = "vulnerable-app";
const defaultDownloadFolder = path.resolve(__dirname, "downloads");

// Ensure the default download folder exists
if (!fs.existsSync(defaultDownloadFolder)) {
  fs.mkdirSync(defaultDownloadFolder, { recursive: true });
}

// Endpoint to execute a command in the Docker container
app.post("/execute-command", async (req, res) => {
  const { command } = req.body;

  console.log("Received command to execute:", command);

  const isCopyCommand = command.startsWith("cp ");

  if (isCopyCommand) {
    const parts = command.split(" ");
    if (parts.length !== 2) {
      return res.status(400).send({
        message: "Invalid cp command format. Use cp [source].",
      });
    }

    const containerFilePath = parts[1];
    const fileName = path.basename(containerFilePath);
    const localFilePath = path.join(defaultDownloadFolder, fileName);

    try {
      // Create and start a container
      const container = await docker.createContainer({
        Image: imageName,
        Cmd: ["/bin/bash"],
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        Tty: true,
      });

      await container.start();

      // Archive and extract the file from the specified path
      const fileStream = await container.getArchive({
        path: containerFilePath,
      });
      const extract = tar.extract(defaultDownloadFolder);

      fileStream
        .pipe(extract)
        .on("finish", async () => {
          await container.stop();
          await container.remove();
          console.log(
            "File successfully copied and container stopped and removed."
          );
          res.download(localFilePath, fileName, (err) => {
            if (err) {
              console.error("Error downloading file:", err);
              res.status(500).send({
                message: "Failed to download file",
                error: err.message,
              });
            }
            fs.unlink(localFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error removing local file:", unlinkErr);
              }
            });
          });
        })
        .on("error", async (err) => {
          await container.stop();
          await container.remove();
          console.error("Error extracting file:", err);
          res
            .status(500)
            .send({ message: "Failed to copy file", error: err.message });
        });
    } catch (error) {
      console.error("Error executing command:", error);
      res
        .status(500)
        .send({ message: "Failed to execute command", error: error.message });
    }
  } else if (command.startsWith("nmap ") || command.startsWith("nc ")) {
    // Execute nmap or nc inside a Docker container
    try {
      const container = await docker.createContainer({
        Image: imageName,
        Cmd: ["/bin/bash"],
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        Tty: true,
      });

      await container.start();

      const execInstance = await container.exec({
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ["/bin/bash", "-c", command],
        Tty: false,
      });

      const stream = await execInstance.start({ stdin: true });

      const output = await new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", (chunk) => (data += chunk.toString()));
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
      });

      await container.stop();
      await container.remove();

      res.send({ message: "Command executed successfully", output });
    } catch (error) {
      console.error("Error executing command:", error);
      res
        .status(500)
        .send({ message: "Failed to execute command", error: error.message });
    }
  } else {
    try {
      const container = await docker.createContainer({
        Image: imageName,
        Cmd: ["/bin/bash"],
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        Tty: true,
      });

      await container.start();

      const execInstance = await container.exec({
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ["/bin/bash", "-c", command],
        Tty: false,
      });

      const stream = await execInstance.start({ stdin: true });

      const output = await new Promise((resolve, reject) => {
        let data = "";
        stream.on("data", (chunk) => (data += chunk.toString()));
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
      });

      await container.stop();
      await container.remove();

      res.send({ message: "Command executed successfully", output });
    } catch (error) {
      console.error("Error executing command:", error);
      res
        .status(500)
        .send({ message: "Failed to execute command", error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
