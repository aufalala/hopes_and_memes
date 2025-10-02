import { useScrollContext } from "../../contexts/ScrollContext";

import Navbar from "./Navbar"
import UserLoginSignup from "./UserLoginSignup"
import styles from "./_Header.module.css"

function Header() {
  const scrollDirection = useScrollContext();

  return (
    <header className={`${styles.header} ${scrollDirection === "down" ? styles.hide : ""}`}>
      <div className={styles.div}><Navbar/></div>
      <div className={styles.title}>HOPES&MEMES</div>
      <div className={styles.div}><UserLoginSignup/></div>
    </header>
  )
}

export default Header