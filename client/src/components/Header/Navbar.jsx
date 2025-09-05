import { Link } from "react-router-dom";
import React from "react";
import { fetchTestImage } from "../../utils/airtableAPI";
import { fetchRandomMeme } from "../../utils/memeAPI";

function Navbar() {
  return (
    <nav>
      <ul>
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
            onClick={() => {
              console.log(fetchTestImage());
            }}
          >
            askdjahsdkjsa
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
            3231321321312
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
