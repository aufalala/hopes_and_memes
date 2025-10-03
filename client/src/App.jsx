//REACT
import { Routes, Route } from "react-router-dom";

//Modals
import LoginSignupModal from "./components/modals/LoginSignupModal.jsx";
//SHARED COMPONENTS
import Header from "./components/header/Header.jsx";
import Content from "./components/content/Content.jsx";
//PAGES
import Home from "./pages/Home.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Unseen from "./pages/Unseen.jsx";
import Profile from "./pages/Profile.jsx";

function App() {

  return (
    <>
      <Header />

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unseen" element={<Unseen />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/profile/:userId" element={<Profile />} />    
        </Routes>
      </Content>

      <LoginSignupModal />
    </>
  );
}

export default App;
