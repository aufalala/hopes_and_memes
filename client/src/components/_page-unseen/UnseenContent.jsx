import { useEffect, useState } from "react"
import { apiGetUnratedMemes } from "../../services/redisAPI.js"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";
import MemeCards from "../__reuseables/MemeCards.jsx";

import styles from "./_UnseenContent.module.css"


function UnseenContent() {

  const { fetchWithAuth } = useClerkAuthFetch();

  const [unratedMemes, setUnratedMemes] = useState([]);


  // MAYBE getUnratedMemes GOES INTO CONTEXT AND "STORED" AS CACHE AND CHECK FOR CHANGES WHEN THIS PAGE LOADS??? 
  useEffect(() => {
    (async function pageLoad() {
      try {
        const result = await apiGetUnratedMemes(fetchWithAuth);
        setUnratedMemes(result);
      } catch (e) {
        console.error("apiGetUnratedMemes FAILED:", e);
      }
    })();

    unratedMemes.forEach((meme) => {
      const img = new Image();
      img.src = meme.postLink;
    });


  }, []) // MAYBE TRIGGER getUnratedMemes WHEN SCROLL THRESHOLD REACHED

  return (
    <div className={styles.cardsContainer}>
      {unratedMemes.length>0 ?
      unratedMemes.map((meme) => (
        <MemeCards key={meme.postLink} meme={meme} rateType={"unrated"}/>
      )) :
      <div>WOW NO MEMES?</div>
      }
    </div>
  )
}

export default UnseenContent