import styles from "./_Pages.module.css"
import HomeSidebar from "../components/_page-home/HomeSidebar"
import HomeContent from "../components/_page-home/HomeContent" 

function Home() {
  return (
    <div className={styles.homeContainer}>
      <HomeSidebar/>
      <HomeContent/>
    </div>
  )
}

export default Home