import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/FileStealing.css";

function FileStealing() {
  const [command, setCommand] = useState("");
  const [commandsAndOutputs, setCommandsAndOutputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("scan"); // Initial step is to scan for open ports

  useEffect(() => {
    // Call the API endpoint to start the practicum when the component mounts
    const startPracticum = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/start-practicum"
        );
        console.log(response.data);
      } catch (error) {
        console.error("There was an error starting the practicum!", error);
      }
    };

    startPracticum();
  }, []); // Empty dependency array ensures this runs only once after initial render
  const handleInputChange = (event) => {
    setCommand(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const newCommand = command.trim().toLowerCase();

    // Handle cls command separately to clear the terminal
    if (newCommand === "cls") {
      setCommandsAndOutputs([]);
      setCommand("");
      return;
    }

    // Enforce step-by-step process
    if (step === "scan" && !newCommand.startsWith("nmap ")) {
      setCommandsAndOutputs((prev) => [
        ...prev,
        {
          command: newCommand,
          output: "You must scan for open ports first using the nmap command.",
        },
      ]);
      setCommand("");
      return;
    }

    if (step === "connect" && !newCommand.startsWith("nc ")) {
      setCommandsAndOutputs((prev) => [
        ...prev,
        {
          command: newCommand,
          output: "You must connect to the open port using the nc command.",
        },
      ]);
      setCommand("");
      return;
    }

    if (
      step === "done" &&
      (newCommand.startsWith("nmap ") || newCommand.startsWith("nc "))
    ) {
      setCommandsAndOutputs((prev) => [
        ...prev,
        {
          command: newCommand,
          output:
            "You have already scanned ports and connected. Please proceed with other commands.",
        },
      ]);
      setCommand("");
      return;
    }

    setLoading(true);
    setCommandsAndOutputs((prev) => [
      ...prev,
      { command: newCommand, output: "Executing..." },
    ]);
    setCommand(""); // Reset the input field

    try {
      const response = await axios.post(
        "http://localhost:3003/execute-command",
        { command: newCommand },
        {
          responseType: newCommand.startsWith("cp ") ? "blob" : "json",
        }
      );

      if (newCommand.startsWith("nmap ")) {
        setStep("connect");
        setCommandsAndOutputs((prev) =>
          prev.map((item) =>
            item.command === newCommand
              ? { ...item, output: response.data.output }
              : item
          )
        );
      } else if (newCommand.startsWith("nc ")) {
        setStep("done");
        setCommandsAndOutputs((prev) =>
          prev.map((item) =>
            item.command === newCommand
              ? { ...item, output: response.data.output }
              : item
          )
        );
      } else if (newCommand.startsWith("cp ")) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const filename = newCommand.split(" ")[1]; // Source part of the cp command
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        // Add file download message to outputs
        setCommandsAndOutputs((prev) =>
          prev.map((item) =>
            item.command === newCommand
              ? { ...item, output: `Downloaded file to ${filename}` }
              : item
          )
        );
      } else {
        setCommandsAndOutputs((prev) =>
          prev.map((item) =>
            item.command === newCommand
              ? { ...item, output: response.data.output }
              : item
          )
        );
      }
    } catch (error) {
      setCommandsAndOutputs((prev) =>
        prev.map((item) =>
          item.command === newCommand
            ? {
                ...item,
                output:
                  "Error executing command: " +
                  (error.response?.data.message || error.message),
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Make an API call to start the practicum when the component mounts
    axios
      .get("http://localhost:3004/start-practicum")
      .then((response) => {
        console.log("Practicum started successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error starting practicum:", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="FileStealingBody">
        <Sidebar />
        <div className="file-stealing-body">
          <div className="file-stealing-guide">
            <h2>Langkah-langkah Melakukan Praktikum</h2>
            <h3>Langkah 1</h3>
            <p>
              <strong>Scan untuk port yang terbuka</strong> Untuk memeriksa port
              yang terbuka, ketik perintah berikut dan tekan Enter:
              <pre>nmap -p 1-10000 localhost</pre>
              Ini akan memeriksa port yang terbuka di localhost.
            </p>
            <h3>Langkah 2</h3>
            <p>
              <strong>Sambungkan ke port terbuka</strong> Setelah menemukan port
              yang terbuka, sambungkan ke port tersebut menggunakan netcat:
              <pre>nc localhost 9999</pre>
              Ini akan menghubungkan Anda ke port 9999 di localhost.
            </p>
            <h3>Langkah 3</h3>
            <p>
              <strong>Menampilkan direktori awal</strong> Untuk melihat folder
              di direktori awal pada target, ketik perintah berikut dan tekan
              Enter:
              <pre>ls</pre>
              Ini akan menampilkan daftar folder di direktori target.
            </p>
            <h3>Langkah 4</h3>
            <p>
              <strong>
                Masuk ke dalam direktori <code>my-files</code>:
              </strong>{" "}
              Untuk masuk ke dalam direktori <code>my-files</code>, ketik
              perintah berikut dan tekan Enter:
              <pre>ls my-files</pre>
            </p>
            <h3>Langkah 5</h3>
            <p>
              <strong>Daftar File:</strong> Untuk melihat file-file pada
              direktori <code>my-files</code>, ketik perintah berikut dan tekan
              Enter:
              <pre>ls /usr/src/app/my-files</pre>
              Ini akan menampilkan daftar file di direktori{" "}
              <code>my-files</code>. Kita ditugaskan untuk mencari file target
              yang berisi data diri korban.
            </p>
            <h3>Langkah 6</h3>
            <p>
              <strong>Baca File:</strong> Untuk membaca isi dari sebuah file,
              seperti <code>important.txt</code>, ketik perintah berikut dan
              tekan Enter:
              <pre>cat /usr/src/app/my-files/important.txt</pre>
              Ini akan menampilkan isi dari <code>important.txt</code>.
              Gunakanlah perintah <code>cat</code> untuk mencari file target
              yang berisi data diri korban.
            </p>
            <h3>Langkah 7</h3>
            <p>
              <strong>Unduh File:</strong> Setelah menemukan file target yang
              berisi data diri korban, maka kita akan menyalin file tersebut ke
              direktori lokal kita. Untuk mengunduh file dari target ke mesin
              lokal Anda, gunakan perintah <code>cp</code>. Misalnya, untuk
              mengunduh <code>personal-info.txt</code> ke direktori lokal, ketik
              perintah berikut dan tekan Enter:
              <pre>cp /usr/src/app/my-files/personal-info.txt</pre> Ini akan
              otomatis mengunduh file yang kita inginkan, misalnya{" "}
              <code>personal-info.txt</code> ke direktori lokal Anda.
            </p>
          </div>
          <h1 className="file-stealing-title">Command Prompt</h1>
          <div className="file-stealing-output">
            {commandsAndOutputs.map((item, index) => (
              <div key={index}>
                <div className="file-stealing-command">
                  <span>$</span>
                  <span>{item.command}</span>
                </div>
                <pre>{item.output}</pre>
              </div>
            ))}
            <form className="file-stealing-command" onSubmit={handleSubmit}>
              <span>$</span>
              <input
                type="text"
                value={command}
                onChange={handleInputChange}
                className="file-stealing-input"
                autoFocus
                disabled={loading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileStealing;
