import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiGetMeUserData } from "../services/airtableAPI";

import { useClerkAuthFetch } from "../hooks/useClerkAuthFetch";

const UserDataContext = createContext();


export const UserDataProvider = ({ children }) => {
  const { fetchWithAuth } = useClerkAuthFetch();
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [userDataRefresher, setUserDataRefresher] = useState(0);

  useEffect(() => {
  const getMeUserData = async () => {
    if (isLoaded && isSignedIn && user) {
      try {
        const result = await apiGetMeUserData(fetchWithAuth);
        const userRecord = result[0] || {};

        setUserData({
          imageUrl: user.imageUrl,
          fastId: user.id,
          fastUsername: user.username,
          clerk_user_id: userRecord.clerk_user_id,
          username: userRecord.username,
          created_at: userRecord.created_at,
          num_memes_rated: userRecord.num_memes_rated,
          points: userRecord.points
        });

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    } else {
      setUserData(null);
    }
  };

  getMeUserData();
}, [isSignedIn, isLoaded, user, userDataRefresher]);

  return (
    <UserDataContext.Provider value={{ userData, setUserData, setUserDataRefresher }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);