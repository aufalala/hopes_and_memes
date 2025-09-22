import { AIRTABLE_T_MEME_RATINGS } from "../config.js";
import { postToAirtable } from "../services/airtableAPI.js";

import getTimestamp from "../utils/utTimestamp.js";

export async function orcRateUnratedMeme({sourceData, postParams}) {
  console.log(`[${getTimestamp()}] TRYING: orcRateUnratedMeme from ${sourceData}`);
  try {
    const result = await postToAirtable({sourceData, table: AIRTABLE_T_MEME_RATINGS, postParams}); 
  } catch (e) {
    console.error("postToAirtable FAILED:", e);
    throw e;
  }
}