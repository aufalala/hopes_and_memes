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

