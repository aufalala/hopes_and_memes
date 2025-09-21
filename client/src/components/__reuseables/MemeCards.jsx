import { useState } from "react"

import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch.js";
import { useUserData } from "../../contexts/UserDataContext";

import MemeCardsButton from "./MemeCardsButton"

import { apiPostUnratedRating } from "../../services/airtableAPI"

import styles from "./_MemeCards.module.css"


function MemeCards( { meme } ) {

  const { fetchWithAuth } = useClerkAuthFetch();
  const {userData} = useUserData(); 

  const [enlarge, setEnlarge] = useState(false)

  function rateMeme(rating) {
    // insert payload builder here

    try {
      const result = apiPostUnratedRating({fetchWithAuth, payload})
    } catch (e) {

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