import { Link } from "react-router-dom";
import { fetchTestImage, fetchTestImageProtected } from "../../utils/airtableAPI";
import { fetchRandomMeme } from "../../utils/memeAPI";
import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";
import styles from "./_Navbar.module.css"

function Navbar() {
  
  const { fetchWithAuth } = useClerkAuthFetch();
  const links = [
    {
      path: "/",
      text: "Home",
      dropdown: false,
    },
    {
      path: "/about",
      text: "About",
      dropdown: false,
    },
    {
      path: "/more",
      text: "More",
      dropdown: false,
    },  
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

        <li>
          <div
            onClick={async () => {
              try {
                const meme = await fetchTestImage(fetchWithAuth);
                console.log(meme);
              } catch (err) {
                console.error("Failed to fetch test image:", err.message);
              }
            }}
          >
            get unprotected image in console
          </div>
        </li>

        <li>
          <div
            onClick={async () => {
              try {
                const meme = await fetchRandomMeme();
                console.log(meme);
              } catch (err) {
                console.error("Failed to fetch meme:", err.message);
              }
            }}
          >
            get random meme in console
          </div>
        </li>

        <li>
          <div
            onClick={async () => {
              try {
                const meme = await fetchTestImageProtected(fetchWithAuth);
                console.log(meme);
              } catch (err) {
                console.error("Failed to fetch test image protected:", err.message);
              }
            }}
          >
            get protected test image in console
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
