import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useClerkAuthFetch } from "../hooks/useClerkAuthFetch";

import { apiGetUserRatings } from "../services/redisAPI"; // API to get ratings for user

const UserRatingsContext = createContext();

export const UserRatingsProvider = ({ children }) => {
  const { fetchWithAuth } = useClerkAuthFetch();
  const { user, isSignedIn, isLoaded } = useUser();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  let test;
  // Fetch user's ratings on mount
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
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    console.log(ratings)
  }, [ratings])

  return (
    <UserRatingsContext.Provider value={{ ratings, setRatings, loading }}>
      {children}
    </UserRatingsContext.Provider>
  );
};

export const useUserRatings = () => useContext(UserRatingsContext);
