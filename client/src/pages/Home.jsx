import { useEffect, useState } from "react"

import HomeSidebar from "../components/_page-home/HomeSidebar"
import HomeContent from "../components/_page-home/HomeContent" 

import styles from "./_Pages.module.css"

function Home() {

  const [subredditFilter, setSubredditFilter] = useState([]);
  
  function applyFilter(subreddit, checked) {
    setSubredditFilter((prev) => {
      if (checked) {
        return [...prev, subreddit];
      } else {
        return prev.filter((item) => item !== subreddit);
      }
    });
  }

  return (
    <div className={styles.homeContainer}>
      <HomeSidebar applyFilter={applyFilter}/>
      <HomeContent subredditFilter={subredditFilter}/>
    </div>
  )
}

export default Home