import { localServerURL, serverURL } from "./serverURL";

export async function fetchRandomMeme() {
  try {
    const res = await fetch(`${localServerURL}/api/meme`);
    if (!res.ok) throw new Error("Local server response not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Local server failed, trying remote server:", error.message);
    try {
      const res = await fetch(`${serverURL}/api/meme`);
      if (!res.ok) throw new Error("Remote server response not ok");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
}

export async function apiGetTenMemes(fetchWithAuth) {
  return fetchWithAuth("/api/test/meme-count", {}, true);
}

