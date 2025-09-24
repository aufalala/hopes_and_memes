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

export async function apiGetUserVerify(fetchWithAuth) {
  return fetchWithAuth("/api/users/verify", {}, true);
}

export async function apiPostUser(fetchWithAuth) {
  return fetchWithAuth("/api/users", {
    method: "POST",
  }, true);
}

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

export async function apiGetRatedMemes(fetchWithAuth, offset = null) {
  try {
    let url = "/api/airtable/rated-memes";
    if (offset) url += `?offset=${offset}`;

    const res = await fetchWithAuth(url, {}, false);
    if (res.status !== "success") throw new Error("Server response not ok");

    return {records: res.records, offset: res.offset};
  } catch (e) {
    console.error("apiGetRatedMemes FAILED:", e);
    return { records: [], offset: null };
  }
}





//EXAMPLE MAY NO LONGER BE RELEVANT DUE TO CLERK AUTH FETCH ALREADY ADDING HEADER

// EXAMPLE FOR POST
// export async function submitMeme(fetchWithAuth, memeData) {
//   return fetchWithAuth("/submit", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(memeData),
//   }, true); // true = with auth
// }

