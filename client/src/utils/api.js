const localServerURL = "http://localhost:3000";
const serverURL = "https://hopesandmemes-production.up.railway.app";

export async function fetchStatus() {
  try {
    const res = await fetch(`${localServerURL}/status`);
    if (!res.ok) throw new Error("Local server response not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Local server failed, trying remote server:", error.message);
    try {
      const res = await fetch(`${serverURL}/status`);
      if (!res.ok) throw new Error("Remote server response not ok");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
}
