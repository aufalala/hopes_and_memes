import { useScrollContext } from "../../contexts/ScrollContext";
import styles from "./_HomeSidebar.module.css"

function HomeSidebar({ applyFilter }) {
  const scrollDirection = useScrollContext();
  const topOffset = scrollDirection === "down" ? 0 : 85;

  
  const subredditList = ["memes", "dankmemes", "me_irl"];

  const handleFilter = (e) => {
    const { value, checked } = e.target;
    applyFilter(value, checked);
  };

  return (
    <div className={styles.homeSidebar} style={{ top: `${topOffset}px` }}>
      <div className={styles.sidebarTitle}>
        <h4>SUBREDDITS</h4>
        <hr></hr>
      </div>

      <div className={styles.subredditList}>
        {subredditList.map((sub) => (
          <label key={sub} className={styles.subredditItems}>
            <span className={styles.labelText}>{sub}</span>
            <input
              type="checkbox"
              value={sub}
              onChange={handleFilter}
              className={styles.checkbox}
            />
          </label>
        ))}
      </div>



    </div>
  )
}

export default HomeSidebar