import { useEffect, useState } from 'react'
import { useClerkAuthFetch } from '../../hooks/useClerkAuthFetch';
import { useUserData } from '../../contexts/UserDataContext';
import { apiGetAllUsers } from '../../services/redisAPI';
import Spinner from '../__reuseables/Spinner.jsx';


import styles from "./_LeaderboardContent.module.css"

function LeaderboardContent() {

  const {userData} = useUserData();
  const { fetchWithAuth } = useClerkAuthFetch();

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await apiGetAllUsers(fetchWithAuth);

        const sorted = result.sort((a, b) => {
          const pointsA = Number(a.points) || 0;
          const pointsB = Number(b.points) || 0;
          return pointsB - pointsA;
        });

        setAllUsers(sorted);
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };

    fetchUsers();
  }, []);

  return (
  !allUsers ? (
    <Spinner />
  ) : (
    <div className={styles.content}>
      <h2>LEADERBOARD</h2>
      {allUsers.map((user, index) => (
        <div key={user.clerk_user_id}>
          <div
            className={`${styles.userRecord} ${
              user.username === userData?.username ? styles.user : ""
            }`}
          >
            <div className={index < 3 ? styles.topThree : ""}>
              {index + 1}) {user.username.toUpperCase()}
            </div>
            <div className={index < 3 ? styles.topThree : ""}>
              {user.points} POINTS
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  )
);
}

export default LeaderboardContent