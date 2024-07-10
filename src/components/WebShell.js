import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../assets/WebShell.css";

function WebShell({ praktikumId }) {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const shellRef = useRef(null);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = currentCommand.trim();
      if (command === "") return;

      const newHistory = [...commandHistory, { command, type: "command" }];
      setCommandHistory(newHistory);
      setCurrentCommand("");

      try {
        const response = await axios.post(
          "http://localhost:3007/execute-command",
          {
            command,
            praktikumId,
          }
        );
        setCommandHistory([
          ...newHistory,
          { command: response.data.output, type: "output" },
        ]);
      } catch (error) {
        setCommandHistory([
          ...newHistory,
          {
            command: `Error: ${
              error.response ? error.response.data : error.message
            }`,
            type: "error",
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (shellRef.current) {
      shellRef.current.scrollTop = shellRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return (
    <div className="web-shell">
      <div className="shell-output" ref={shellRef}>
        {commandHistory.map((item, index) => (
          <div key={index} className={`shell-line ${item.type}`}>
            {item.command}
          </div>
        ))}
        <div className="shell-input">
          <span>$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default WebShell;
