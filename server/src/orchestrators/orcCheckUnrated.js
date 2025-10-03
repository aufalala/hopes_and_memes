import { queues } from "../redis/queues/queues.js";
import { getUnratedMemeCount } from "../services/airtableAPI.js";
import getTimestamp from "../utils/utTimestamp.js";



export async function orcCheckUnrated({ sourceData }) {
  console.log(`[${getTimestamp()}] TRYING: orcCheckUnrated from ${sourceData}`);

  try {
      const result = await getUnratedMemeCount(sourceData);
      console.log(`[${getTimestamp()}] orcCheckUnrated: ${result.status}, ${result.count}`);
  
      if (result.count <= 5) {
        console.log(`[${getTimestamp()}] orcCheckUnrated: Meme Count <= 5`)
        
        try {
          const existingJobs = await queues.getTenMemesQueue.getWaiting();
          console.log(existingJobs);
          const alreadyQueued = existingJobs.length > 0;
  
          if (!alreadyQueued) {
            
            try {
              await queues.getTenMemesQueue.add(
              "get-ten-memes-job",
              {sourceData},  
              { attempts: 5, removeOnComplete: true, removeOnFail: true }
            );
              console.log(`[${getTimestamp()}] orcCheckUnrated: getTenMemesQueue job added to queue`);
              return {status: "success"}
            
            } catch (e) {
              console.error(e);
              return {error: e.message};
            }
  
          } else {
              console.log(`[${getTimestamp()}] orcCheckUnrated: getTenMemesQueue already queued`);
              return {status: "success"}
          }
  
        } catch (e) {
          console.error(e);
          return {error: e.message};
        }
      } else {
        return {status: "success"}
      }
  
    } catch (e) {
      console.error(e);
        return {error: e.message};
    }
}