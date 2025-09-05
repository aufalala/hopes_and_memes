import { localServerURL, serverURL } from "./serverURL";

export async function fetchRandomMeme() {
  try {
    const res = await fetch(`${localServerURL}/meme`);
    if (!res.ok) throw new Error("Local server response not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Local server failed, trying remote server:", error.message);
    try {
      const res = await fetch(`${serverURL}/meme`);
      if (!res.ok) throw new Error("Remote server response not ok");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
}