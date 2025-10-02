import { useState } from "react"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch.js";
import { useUserRatings } from "../../contexts/UserRatingsContext.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";

import MemeCardsButton from "./MemeCardsButton"

import { apiPostRatedRating, apiPostUnratedRating } from "../../services/redisAPI"

import styles from "./_MemeCards.module.css"


function MemeCards({ meme, rateType }) {

  const { fetchWithAuth } = useClerkAuthFetch();
  
  const { ratings, setRatingRefresher } = useUserRatings();
  const { setUserDataRefresher } = useUserData();
  const [enlarge, setEnlarge] = useState(false)

  const memeRating = ratings.find(r => r.postLink === meme.postLink);

  async function rateMeme(rating) {
    const payload = { postLink: meme.postLink, rating };

    if (rateType === "unrated") {
      try {
        const result = await apiPostUnratedRating({ fetchWithAuth, payload });
        console.log(result)
      } catch (e) {
        console.error("Error rating meme:", e);
      }

    } else if (rateType === "rated") {
      try {
        const result = await apiPostRatedRating({ fetchWithAuth, payload });
        console.log(result)
      } catch (e) {
        console.error("Error rating meme:", e);
      }
    }
    
    setUserDataRefresher((prev) => prev + 1)
    setRatingRefresher((prev) => prev + 1)

  }

  return (
    <div className={styles.card} onMouseEnter={() => setEnlarge(true)} onMouseLeave={() => setEnlarge(false)}>
          
      <div className={styles.title}>
          <h2>{meme.title}</h2>
      </div>

      <div className={styles.imageContainer}>
        <img src={meme.url} alt={meme.title} className={styles.img}/>
      </div>

      <div>
        <MemeCardsButton rateMeme={rateMeme} enlarge={enlarge} currentRating={memeRating?.rating}/>
      </div>
      <hr></hr>

    </div>
  )
}

export default MemeCards