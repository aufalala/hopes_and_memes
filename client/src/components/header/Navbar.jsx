import { Link } from "react-router-dom";
import { fetchTestImage, fetchTestImageProtected } from "../../utils/airtableAPI";
import { fetchRandomMeme } from "../../utils/memeAPI";
import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";
import styles from "./_Navbar.module.css"
import { style } from "framer-motion/client";

function Navbar() {
  
  const { fetchWithAuth } = useClerkAuthFetch();

  return (
    <nav>
      <ul className={styles.ul}>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/more">More</Link>
        </li>

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
