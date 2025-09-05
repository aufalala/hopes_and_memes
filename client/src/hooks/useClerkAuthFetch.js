import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { localServerURL, serverURL } from "../utils/serverURL";

export function useClerkAuthFetch() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [token, setToken] = useState(null);

  // UPDATE TOKEN
  useEffect(() => {
    async function updateToken() {
      if (isLoaded && isSignedIn) {
      const t = await getToken();
      console.log("Clerk token:", t);
        setToken(t);
      } else {
        setToken(null);
      }
    }
    updateToken();
  }, [isSignedIn, isLoaded, getToken]);

  // FETCH FUNCTION
  const fetchWithAuth = useCallback(
    async (path, options = {}, withAuth = false) => {
      
      if (withAuth && !token) {
        throw new Error("Authentication required but no token available.");
      }

      const finalOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...(withAuth && token && { Authorization: `Bearer ${token}` }),
        },
      };

      if (withAuth && token) {
        finalOptions.headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const res = await fetch(`${localServerURL}${path}`, finalOptions);
        if (!res.ok) throw new Error("Local server response not ok");
        return await res.json();
      } catch (error) {
        console.warn("Local server failed, trying remote server:", error.message);
        try {
          const res = await fetch(`${serverURL}${path}`, finalOptions);
          if (!res.ok) throw new Error("Remote server response not ok");
          return await res.json();
        } catch (err) {
          throw err;
        }
      }
    },
    [token]
  );

  return { fetchWithAuth, token };
}