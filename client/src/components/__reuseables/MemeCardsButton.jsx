import { style } from "framer-motion/client";
import { useState } from "react";
import styles from "./_MemeCardsButton.module.css"

function MemeCardsButton( { rateMeme, enlarge } ) {
  
  const [hoveredRating, setHoveredRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  function handleRateMeme(rating) {
    rateMeme(rating);
  }

  return (
    <div className={styles.mainButtonsContainer}>

      <div className={`${styles.rateButtonsContainer} ${enlarge ? styles.enlargeDiv : ""}`}>
        {stars.map((star) => (
        <div
          key={star}
          className={`${styles.rateButtons} ${enlarge ? styles.starEnlarge : ""}`}
          onClick={() => handleRateMeme(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          {star <= hoveredRating ? "★" : "☆"}
        </div>
      ))}
      </div>

      <div className={styles.actionButtonsContainer}>
        
        <div className={styles.actionButtons}>
          Comment
        </div>

        <div className={styles.actionButtons}>
          Reshare
        </div>

      </div>

    </div>
  )
}

export default MemeCardsButton