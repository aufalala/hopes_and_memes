import { useScrollContext } from "../../contexts/ScrollContext";
import styles from "./_HomeSidebar.module.css"

function HomeSidebar() {
  const scrollDirection = useScrollContext();
  const topOffset = scrollDirection === "down" ? 0 : 80;

  return (
    <div className={styles.HomeSidebar} style={{ top: `${topOffset}px` }}>
      homeSidebar
    </div>
  )
}

export default HomeSidebar