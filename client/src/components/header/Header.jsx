import { style } from "framer-motion/client"
import Navbar from "./Navbar"
import UserLoginSignup from "./UserLoginSignup"
import styles from "./_Header.module.css"

function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.div}><Navbar/></div>
      <div className={styles.div}><UserLoginSignup/></div>
    </header>
  )
}

export default Header