export async function apiGetUnratedMemes(fetchWithAuth) {
  try {
    const res = await fetchWithAuth("/api/redis/unrated-memes", {}, false);
    if (!res.status === "success") throw new Error("Server response not ok");
    const data = res.memes;
    return data;
  } catch (e) {
    console.error("apiGetUnratedMemes FAILED:", e);
  }
}

export async function apiGetUserRatings(fetchWithAuth) {
  try {
    const res = await fetchWithAuth("/api/users/me/ratings", {}, true);
    if (!res.status === "success") throw new Error("Server response not ok");
    
    const data = res.records;
    return data;
  } catch (e) {
    console.error("apiGetUserRatings FAILED:", e);
  }
}

export async function apiPostUnratedRating({fetchWithAuth, payload}) {
  try {
    return await fetchWithAuth("/api/redis/unrated-meme-rating", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  } catch (e) {
    console.error("apiPostUnratedRating FAILED:", e);
  }
}

export async function apiPostRateddRating({fetchWithAuth, payload}) {
  try {
    return await fetchWithAuth("/api/redis/rated-meme-rating", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  } catch (e) {
    console.error("apiPostRatedRating FAILED:", e);
  }
}