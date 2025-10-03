export async function fetchStatus(fetchWithAuth) {
  return fetchWithAuth("/api/test");
}
export async function fetchTestImage(fetchWithAuth) {
  return fetchWithAuth("/api/test/testImage");
}
export async function fetchTestImageProtected(fetchWithAuth) {
  return fetchWithAuth("/api/test/testImage/protected", {}, true);
}
////////////////////////////////////////////////////////////////////////////

export async function apiGetMeUserData(fetchWithAuth) {
  try {
    const res = await fetchWithAuth("/api/users/me", {}, true);
    if (!res.status === "success") throw new Error("Server response not ok");
    
    const data = res.records;
    return data;

  } catch (e) {
    console.error("apiGetMeUserData FAILED:", e);
  }
}

export async function apiGetRatedMemes(fetchWithAuth, cursor = null, subredditFilter = []) {
  try {
    let url = "/api/airtable/rated-memes";
    const params = new URLSearchParams();

    if (cursor) params.append("cursor", cursor);
    if (subredditFilter.length > 0) {
      params.append("subreddits", JSON.stringify(subredditFilter));
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }

    const res = await fetchWithAuth(url, {}, false);
    if (res.status !== "success") {
      throw new Error("Server response not ok");
    }
    return { records: res.records, cursor: res.cursor };
    
  } catch (e) {
    console.error("apiGetRatedMemes FAILED:", e);
    return { records: [], cursor: null };
  }
}
