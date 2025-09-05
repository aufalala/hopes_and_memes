//REACT
import { useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
//CLERK
import { useClerkAuthFetch } from "./hooks/useClerkAuthFetch";
//UTILS
import { fetchStatus } from "./utils/airtableAPI.js";

//SHARED COMPONENTS
import Header from "./components/Header/Header.jsx";
import Body from "./components/Body/Body.jsx";
//PAGES
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import More from "./pages/More.jsx";

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

  // //GET AND SET CLERK TOKEN
  // const { getToken, isSignedIn, isLoaded } = useAuth();
  // useEffect(() => {
  //   const updateToken = async () => {
  //     if (isLoaded && isSignedIn) {
  //       const token = await getToken();
  //       setClerkToken(token);
  //     } else {
  //       setClerkToken(null);
  //     }
  //   };
  //   updateToken();
  // }, [isSignedIn, isLoaded]);


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
