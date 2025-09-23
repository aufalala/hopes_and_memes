import redisConnection from "./connection.js";
import { getRecordsFromAirtable } from "../services/airtableAPI.js";
import getTimestamp from "../utils/utTimestamp.js";

export async function syncCache({table, keyPrefix, useKeySuffix, sourceData}) {
  console.log(`[${getTimestamp()}] syncCache: Syncing cache for ${table}...`);
  const result = await getRecordsFromAirtable({sourceData, table});
  const records = result.records;

  if (!records || records.length === 0) {
    console.warn(`[${getTimestamp()}] syncCache: No records found for ${table}`);
    return [];
  }

  for (const record of records) {
    const key = `${keyPrefix}:${record[useKeySuffix]}`;
    await redisConnection.set(key, JSON.stringify(record));
  }

  console.log(`[${getTimestamp()}] syncCache: Cached ${records.length} records for ${table} with ${keyPrefix}`);
  return records;
}
