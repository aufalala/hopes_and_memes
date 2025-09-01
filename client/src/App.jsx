import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { fetchStatus } from "./utils/api";
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
        setStatus("Cannot contact proxy server!");
      }
    }
    getStatus();
  }, []);

  return (
    <>
      <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
      <p>{status}</p>
    </>
  );
}

export default App;
