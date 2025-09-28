import redisConnection from "./connection.js";
import { getRecordsFromAirtable } from "../services/airtableAPI.js";
import getTimestamp from "../utils/utTimestamp.js";

export async function syncCacheHash({ table, keyPrefix, useKeySuffix, useIdentifierHash, sourceData }) {
  console.log(`[${getTimestamp()}] syncCacheHash: Syncing cache for ${table}...`);
  
  const result = await getRecordsFromAirtable({ sourceData, table });
  const records = result.records;

  if (!records || records.length === 0) {
    console.warn(`[${getTimestamp()}] syncCacheHash: No records found for ${table}`);
    return [];
  }

  // Group records by (useKeySuffix)
  const groupedRecords = {};

  for (const record of records) {
    const groupKey = record[useKeySuffix];
    if (!groupedRecords[groupKey]) groupedRecords[groupKey] = [];
    groupedRecords[groupKey].push(record);
  }

  // Store each group in Redis
  for (const [groupKey, groupRecords] of Object.entries(groupedRecords)) {
    const redisKey = `${keyPrefix}:${groupKey}`;

    if (useIdentifierHash) {
      // Use dynamic identifier field for HSET
      const batch = {};
      for (const record of groupRecords) {
        const fieldKey = record[useIdentifierHash];
        batch[fieldKey] = JSON.stringify(record);
      }
      
      //222// 000000000000000000 CAN USE MODULAR FUNCTION IN REDIS API
      await redisConnection.hset(redisKey, batch);

    } else {
      // No identifier field → store entire array under the key
      
      //222// 000000000000000000 CAN USE MODULAR FUNCTION IN REDIS API
      await redisConnection.set(redisKey, JSON.stringify(groupRecords));
    }
  }

    console.log(`[${getTimestamp()}] syncCacheHash: Cached ${records.length} records for ${table} in hash ${keyPrefix}`);
    return records;
  }
