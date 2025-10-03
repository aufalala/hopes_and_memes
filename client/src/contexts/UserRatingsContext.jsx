import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useClerkAuthFetch } from "../hooks/useClerkAuthFetch";

import { apiGetUserRatings } from "../services/redisAPI";

const UserRatingsContext = createContext();

export const UserRatingsProvider = ({ children }) => {
  const { fetchWithAuth } = useClerkAuthFetch();
  const { user, isSignedIn, isLoaded } = useUser();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingRefresher, setRatingRefresher] = useState(0);
  
  useEffect(() => {
    if (!user) return;

    const loadRatings = async () => {
      setLoading(true);
      try {
        const userRatings = await apiGetUserRatings(fetchWithAuth);
        setRatings(userRatings || []);
      } catch (e) {
        console.error("Failed to fetch user ratings:", e);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [user, isLoaded, isSignedIn, ratingRefresher]);

  return (
    <UserRatingsContext.Provider value={{ ratings, setRatings, loading, setRatingRefresher }}>
      {children}
    </UserRatingsContext.Provider>
  );
};

export const useUserRatings = () => useContext(UserRatingsContext);
