import { Link } from "react-router-dom";
import styles from "./_Navbar.module.css"

function Navbar() {
  
  const links = [
    {
      path: "/",
      text: "HOME",
      dropdown: false,
    },
    {
      path: "/unseen",
      text: "UNSEEN",
      dropdown: false,
    },
    {
      path: "/leaderboard",
      text: "LEADERBOARDS",
      dropdown: false,
    },
    // {
    //   path: "/about",
    //   text: "About",
    //   dropdown: false,
    // },
    // {
    //   path: "/more",
    //   text: "More",
    //   dropdown: false,
    // },
  ]

  return (
    <nav>
      <ul className={styles.ul}>

        {links.map((link, index) => {
          return (
            <li key={index}>
              <Link to={link.path}>{link.text}</Link>
            </li>
          )
        })}

      </ul>
    </nav>
  );
}

export default Navbar;
