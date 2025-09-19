import styles from "./_MemeCardsButton.module.css"

function MemeCardsButton( { rateMeme } ) {

  function handleRateMeme(rating) {
    rateMeme(rating);
  }

  return (
    <div>
      <div className={styles.rateButtonsContainer}>
        <div className={styles.rateButtons}>1</div>
        <div className={styles.rateButtons}>2</div>
        <div className={styles.rateButtons}>3</div>
        <div className={styles.rateButtons}>4</div>
        <div className={styles.rateButtons}>5</div>
      </div>
    </div>
  )
}

export default MemeCardsButton