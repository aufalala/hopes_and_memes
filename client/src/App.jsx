//REACT
import { useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
//CLERK
import { useClerkAuthFetch } from "./hooks/useClerkAuthFetch";
//UTILS
import { fetchStatus } from "./utils/airtableAPI.js";

//Modals
import { ModalProvider } from "./contexts/ModalContext.jsx";
import LoginSignupModal from "./components/modals/LoginSignupModal.jsx";
//SHARED COMPONENTS
import Header from "./components/header/Header.jsx";
import Content from "./components/content/Content.jsx";
//PAGES
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import More from "./pages/More.jsx";
import Profile from "./pages/Profile.jsx";

// CSS
import "./App.css";

function App() {

  const { fetchWithAuth } = useClerkAuthFetch();

  //CHECK SERVER-AIRTABLE STATUS
  const [status, setStatus] = useState("Checking connection...");
  useEffect(() => {
    async function getStatus() {
      try {
        const data = await fetchStatus(fetchWithAuth);
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
    <ModalProvider>    
      
      <Header />

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/more" element={<More />} />  
          <Route path="/profile" element={<Profile />} />    
        </Routes>
      </Content>

      <p>{status}</p>

      <LoginSignupModal />

    </ModalProvider>
  );
}

export default App;
