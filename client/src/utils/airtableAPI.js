export async function fetchStatus(fetchWithAuth) {
  return fetchWithAuth("/test");
}

export async function fetchTestImage(fetchWithAuth) {
  return fetchWithAuth("/test/testImage");
}

export async function fetchTestImageProtected(fetchWithAuth) {
  return fetchWithAuth("/test/testImage/protected", {}, true);
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

