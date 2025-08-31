import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    fetch("https://hopesandmemes-production.up.railway.app/status") // adjust URL/port if needed
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStatus("Proxy server and Airtable are connected!");
        } else {
          setStatus(`Error: ${data.message}`);
        }
      })
      .catch(err => {
        setStatus("Cannot contact proxy server.");
      });
  }, []);

  return (
    <>
      <p>{status}</p>
    </>
  );
}

export default App;
