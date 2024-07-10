const express = require("express");
const shell = require("shelljs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3004; // Choose a port for your server

app.use(cors());

// Serve the link to start the practicum
app.get("/start-practicum", (req, res) => {
  // Path to your PowerShell script
  const scriptPath = path.resolve(__dirname, "start_practicum.ps1");

  // Execute the PowerShell script
  shell.exec(
    `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`,
    (code, stdout, stderr) => {
      if (code !== 0) {
        console.error("Error executing script:", stderr);
        res.status(500).send("Error starting practicum.");
      } else {
        console.log("Script executed successfully:", stdout);
        res.send("Practicum started successfully.");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
