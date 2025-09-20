import { useEffect, useState } from "react"
import { getUnratedMemes } from "../../services/redisAPI.js"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";
import MemeCards from "../__reuseables/MemeCards.jsx";

import styles from "./_UnseenContent.module.css"


function UnseenContent() {

  const { fetchWithAuth } = useClerkAuthFetch();

  const [unratedMemes, setUnratedMemes] = useState([]);

  useEffect(() => {
    (async function pageLoad() {
      try {
        const result = await getUnratedMemes(fetchWithAuth);
        setUnratedMemes(result);
      } catch (e) {
        console.error("getUnratedMemes FAILED:", e);
      }
    })();

    unratedMemes.forEach((meme) => {
      const img = new Image();
      img.src = meme.postLink;
    });


  }, [])

  return (
    <div className={styles.cardsContainer}>
      {unratedMemes.map((meme, index) => (
          <MemeCards key={index} meme={meme}/>
      ))}
    </div>
  )
}

export default UnseenContent