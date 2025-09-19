export async function getUnratedMemes(fetchWithAuth) {
  try {
    const res = await fetchWithAuth("/api/redis/unrated-memes", {}, false);
    if (!res.status === "success") throw new Error("Local server response not ok");
    const data = res.memes;
    return data;
  } catch (e) {
    console.error("getUnratedMemes FAILED:", e);
  }
}