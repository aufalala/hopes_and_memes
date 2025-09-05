import { useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { fetchStatus } from "./utils/airtableAPI.js";

import Header from "./components/Header/Header.jsx";
import Body from "./components/Body/Body.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import More from "./pages/More.jsx";

import "./App.css";
function App() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    async function getStatus() {
      try {
        const data = await fetchStatus();
        if (data.status === "success") {
          setStatus(`Success: ${data.message}`);
        } else {
          setStatus(`Error: ${data.message}`);
        }
      } catch {
        setStatus("Cannot contact proxy server.");
      }
    }
    getStatus();
  }, []);

  return (
    <>    
    <Header/>

    <Body>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/more" element={<More />} />
        
      </Routes>
    </Body>
      <p>{status}</p>
    </>
  );
}

export default App;
