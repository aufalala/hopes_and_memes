import getTimestamp from "../utils/utTimestamp.js";

const memeApiUrl = "https://meme-api.com/gimme";

//222// USED BY WORKER TO GET 10 MEMES FROM MEME API
export async function getTenMemes(sourceData) {
  console.log(`[${getTimestamp()}] TRYING: getTenMemes from ${sourceData}`);
    try {
      const response = await fetch(`${memeApiUrl}/10`)
      if (!response.ok) {
        throw new Error(`[${getTimestamp()}] getTenMemes: Meme API error: ${response.status}`);
      }

      const data = await response.json();
      
      // get more memes if API returned <10
      while (data.memes.length <10) {
        console.log(`[${getTimestamp()}] getTenMemes: Memes less than 10, count: ${data.memes.length}`);
        try {
          const memeRetry = await fetch(`${memeApiUrl}/${10-data.memes.length}`)
          if (!memeRetry.ok) {
            throw new Error(`[${getTimestamp()}] getTenMemes: Meme API retry error: ${memeRetry.status}`);
          }
          const retryData = await memeRetry.json();
          data.memes = [...data.memes, retryData.memes]
        
        } catch (e) {
          console.error(`[${getTimestamp()}] getTenMemes: Meme retrieval failed:`, e);
          throw e;
        } 

      }
      const payload = {status: "success", memes: data.memes,};
      console.log(`[${getTimestamp()}] getTenMemes: Meme count: ${payload.memes.length}`)
      return payload;

    } catch (e) {
      console.error(`[${getTimestamp()}] getTenMemes: Meme retrieval failed:`, e);
      throw e;
    }
}