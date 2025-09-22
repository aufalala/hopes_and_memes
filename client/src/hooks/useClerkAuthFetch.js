import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { localServerURL, serverURL } from "../services/serverURL";

export function useClerkAuthFetch() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const fetchWithAuth = useCallback(
    async (path, options = {}, withAuth = false) => {

      let token = null;

      if (withAuth) {
        if (!isLoaded) {
          throw new Error("Clerk is not loaded yet");
        }
        if (!isSignedIn) {
          throw new Error("User is not signed in.");
        }

        const method = options.method?.toUpperCase() || "GET";
        if (method !== "GET") {
          token = await getToken({ skipCache: true });
        } else {
          token = await getToken();
        }
      }

      const finalOptions = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          ...(withAuth && token && { Authorization: `Bearer ${token}` }),
        },
      };

      try {
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

      } catch (e) {
        console.warn("Local server failed, trying remote server:", e.message);

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

        } catch (e2) {
          console.warn("Remote server failed:", e2.message);
          throw e2;
        }
      }
    },
    [getToken, isSignedIn, isLoaded]
  );

  return { fetchWithAuth };
}