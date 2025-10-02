import LeaderboardContent from '../components/_page-leaderboard/LeaderboardContent.jsx'

import styles from "./_Pages.module.css"

function LeaderBoard() {
  return (
    <div className={styles.leaderboardContainer}>
      <LeaderboardContent />
    </div>
  )
}

export default LeaderBoard