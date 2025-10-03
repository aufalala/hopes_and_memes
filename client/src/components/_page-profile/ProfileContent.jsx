
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGetUserProfile } from "../../services/redisAPI";
import { useClerkAuthFetch } from "../../hooks/useClerkAuthFetch";

import styles from "./_ProfileContent.module.css"

function ProfileContent() {
  const { fetchWithAuth } = useClerkAuthFetch();
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState();


  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const result = await apiGetUserProfile(fetchWithAuth, userId);
        setUserProfile(result.records[0]);
      };

      fetchUser();
    }
  }, [userId]);
  
  
  return (
    (userProfile && 
      <div className={styles.userContainer}>
        <div className={styles.left}>
          <img src={userProfile.image_url} className={styles.avatar}></img>
          <div className={styles.userDetails}>
            <div className={styles.points}>{userProfile.points} POINTS</div>
            <div className={styles.username}>{userProfile.username.toUpperCase()}</div>
          </div>
        </div>
        
        <div className={styles.right}>
          <div>Joined:</div>
          <div className={styles.createdAt}>{new Date(Number(userProfile.created_at)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", })}</div>
        </div>

      </div>
    )
  )
}

export default ProfileContent