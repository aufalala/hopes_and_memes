import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { localServerURL, serverURL } from "../services/serverURL";

export function useClerkAuthFetch() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [token, setToken] = useState(null);

  // UPDATE TOKEN
  useEffect(() => {
    async function updateToken() {
      if (isLoaded && isSignedIn) {
      const pulledToken = await getToken();
        setToken(pulledToken);
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
          'Content-Type': 'application/json',
          ...options.headers,
          ...(withAuth && token && { Authorization: `Bearer ${token}` }),
        },
      };

      try {
        console.log(localServerURL)
        console.log(path);
        console.log(finalOptions)
        const res = await fetch(`${localServerURL}${path}`, finalOptions);
        if (!res.ok) throw new Error("Local server response not ok");
          const contentType = res.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        } else {
          const text = await res.text();
          console.warn(`Non-JSON response from ${localServerURL}:`, text);
          throw new Error("Expected JSON, but got non-JSON response");
        }
      } catch (error) {
        console.warn("Local server failed, trying remote server:", error.message);
        try {
          const res = await fetch(`${serverURL}${path}`, finalOptions);
          if (!res.ok) throw new Error("Remote server response not ok");
            const contentType = res.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          return await res.json();
        } else {
          const text = await res.text();
          console.warn(`Non-JSON response from ${serverURL}:`, text);
          throw new Error("Expected JSON, but got non-JSON response");
        }
        } catch (err) {
          throw err;
        }
      }
    },
    [token]
  );

  return { fetchWithAuth, token };
}