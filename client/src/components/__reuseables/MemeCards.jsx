import { useState } from "react"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch.js";
import { useUserData } from "../../contexts/UserDataContext";

import MemeCardsButton from "./MemeCardsButton"

import { apiPostUnratedRating } from "../../services/redisAPI"

import styles from "./_MemeCards.module.css"


function MemeCards( { meme } ) {

  const { fetchWithAuth } = useClerkAuthFetch();
  const {userData} = useUserData(); 

  const [enlarge, setEnlarge] = useState(false)

  async function rateMeme(rating) {
    const payload = { postLink: meme.postLink, rating };

    try {
      const result = await apiPostUnratedRating({ fetchWithAuth, payload });
      // do something with result if needed
      console.log(result)
    } catch (e) {
      // handle error
      console.error("Error rating meme:", e);
    }
  }

  return (
    <div className={styles.card} onMouseEnter={() => setEnlarge(true)} onMouseLeave={() => setEnlarge(false)}>
      
      
      
      <div className={styles.title}>
          <h2>{meme.title}</h2>
      </div>

      <div className={styles.imageContainer}>
        <img src={meme.url} className={styles.img}/>
      </div>

      <div>
        <MemeCardsButton rateMeme={rateMeme} enlarge={enlarge}/>
      </div>
      <hr></hr>


    </div>
  )
}

export default MemeCards