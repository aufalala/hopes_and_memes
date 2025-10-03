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

      const baseURL = import.meta.env.DEV ? localServerURL : serverURL;

      const res = await fetch(`${baseURL}${path}`, finalOptions);
      if (!res.ok) throw new Error("Server response not ok");

      const contentType = res.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        return await res.json();
      } else {
        const text = await res.text();
        console.warn(`Expected JSON, got:`, text);
        throw new Error("Expected JSON response");
      }
    },
    [getToken, isSignedIn, isLoaded]
  );

  return { fetchWithAuth };
}