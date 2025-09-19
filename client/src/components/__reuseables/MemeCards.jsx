import styles from "./_MemeCards.module.css"
import MemeCardsButton from "./MemeCardsButton"

function MemeCards( { meme } ) {

  function rateMeme(rating) {
    // insert payload builder here

    // insert call post function
  }

  return (
    <div className={styles.card}>
      
      
      
      <div className={styles.title}>
          <h2>{meme.title}</h2>
      </div>

      <div className={styles.imageContainer}>
        <img src={meme.url} className={styles.img}/>
      </div>

      <div>
        <MemeCardsButton rateMeme={rateMeme}/>
      </div>
      <hr></hr>


    </div>
  )
}

export default MemeCards