//REACT
import { useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
//CLERK
import { useClerkAuthFetch } from "./hooks/useClerkAuthFetch";
//SERVICES
import { fetchStatus } from "./services/airtableAPI.js";

//Modals
import { ModalProvider } from "./contexts/ModalContext.jsx";
import LoginSignupModal from "./components/modals/LoginSignupModal.jsx";
//SCROLL FOR HEADER AND SIDEBARS
import { ScrollContextProvider } from "./contexts/ScrollContext.jsx";
//SHARED COMPONENTS
import Header from "./components/header/Header.jsx";
import Content from "./components/content/Content.jsx";
//PAGES
import Home from "./pages/Home.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Unseen from "./pages/Unseen.jsx";
import Profile from "./pages/Profile.jsx";

//PAGES FOR TEST
import About from "./pages/About.jsx";
import More from "./pages/More.jsx";

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
      
      <ScrollContextProvider>
        <Header />

        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unseen" element={<Unseen />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />

            <Route path="/about" element={<About />} />
            <Route path="/more" element={<More />} />


            <Route path="/profile" element={<Profile />} />    
          </Routes>
        </Content>

        <LoginSignupModal />
      
      </ScrollContextProvider>
    </ModalProvider>
  );
}

export default App;
