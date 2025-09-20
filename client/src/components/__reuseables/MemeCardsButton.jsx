import { style } from "framer-motion/client";
import styles from "./_MemeCardsButton.module.css"

function MemeCardsButton( { rateMeme } ) {

  function handleRateMeme(rating) {
    rateMeme(rating);
  }

  return (
    <div className={styles.mainButtonsContainer}>

      <div className={styles.rateButtonsContainer}>
        <div className={styles.rateButtons} onClick={()=> {handleRateMeme(1)}}>1</div>
        <div className={styles.rateButtons}>2</div>
        <div className={styles.rateButtons}>3</div>
        <div className={styles.rateButtons}>4</div>
        <div className={styles.rateButtons}>5</div>
      </div>

      <div className={styles.actionButtonsContainer}>
        
        <div>
          Comment
        </div>

        <div>
          Reshare
        </div>

      </div>

    </div>
  )
}

export default MemeCardsButton