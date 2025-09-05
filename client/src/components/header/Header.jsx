import Navbar from "./Navbar"
import { useModal } from "../../contexts/ModalContext.jsx";

function Header() {
const {openModal} = useModal(); 

  return (
    <header>
      <Navbar/>
      <button onClick={() => openModal("LoginModal")}>Login</button>
      <button onClick={() => openModal("SignupModal")}>Sign Up</button>
    </header>
  )
}

export default Header