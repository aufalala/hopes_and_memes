import { localServerURL, serverURL } from "./serverURL";

export async function fetchStatus() {
  try {
    const res = await fetch(`${localServerURL}/test`);
    if (!res.ok) throw new Error("Local server response not ok");
    
    if (res.ok) console.log("ping test works")
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Local server failed, trying remote server:", error.message);
    try {
      const res = await fetch(`${serverURL}/test`);
      if (!res.ok) throw new Error("Remote server response not ok");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
}


export async function fetchTestImage() {
  try {
    const res = await fetch(`${localServerURL}/test/testImage`);
    if (!res.ok) throw new Error("Local server response not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Local server failed, trying remote server:", error.message);
    try {
      const res = await fetch(`${serverURL}/test/testImage`);
      if (!res.ok) throw new Error("Remote server response not ok");
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }
}