import React, { useEffect } from "react";
import axios from "axios";
import WebApp from '@twa-dev/sdk';

function App() {
  useEffect(() => {
    // Initialize the WebApp
    WebApp.ready();

    // Set the background color based on the theme
    document.body.style.backgroundColor = WebApp.themeParams.bg_color || "#ffffff";
  }, []);

  const sendDataToBackend = () => {
    axios
      .post("http://localhost:5000/send-data", { message: "Hello, Backend!" })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Telegram Mini App</h1>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#2575fc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={sendDataToBackend}
      >
        Send Data
      </button>
    </div>
  );
}

export default App;
