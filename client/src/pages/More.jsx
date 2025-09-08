import { fetchTestImage, fetchTestImageProtected } from "../utils/airtableAPI";
import { fetchRandomMeme } from "../utils/memeAPI";

import { useClerkAuthFetch } from "../hooks/useClerkAuthFetch";

function More() {
  
  const { fetchWithAuth } = useClerkAuthFetch();

  return (
    <>
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
    </>
  )
}

export default More