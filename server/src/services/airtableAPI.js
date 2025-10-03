import {
  AIRTABLE_URL,
  AIRTABLE_TOKEN,
  AIRTABLE_T_UNRATED_MEMES,
  AIRTABLE_T_RATED_MEMES,
  AIRTABLE_T_ALL_USERS,
  AIRTABLE_T_TEST_TABLE,
} from "../config.js";

import getTimestamp from "../utils/utTimestamp.js";

//111/////////////////////////////// --- FORCE IPV4
import https from "https";
import fetch from "node-fetch";
const agent = new https.Agent({ family: 4 });

//111/////////////////////////////// --- FOR PING 
async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

//111/////////////////////////////// --- PING

export async function pingAirtable(sourceData, table = AIRTABLE_T_TEST_TABLE, retries = 3) {
  console.log(`[${getTimestamp()}] TRYING: pingAirtable from ${sourceData}`);
  for (let i = 0; i <= retries; i++) {
    try {

      const response = await fetch(`${AIRTABLE_URL}/${table}`, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        agent,
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      return { status: "success", message: "Proxy connected to Airtable" };
    
    } catch (err) {

      console.error(`Airtable ping failed (attempt ${i + 1}):`, err.message);
      if (i === 3) {console.log(err)}
      if (i < retries) await delay(1000);
    }
  }

  return { status: "failed", message: "Airtable unreachable after retries" };
}

//111/////////////////////////////// --- ALL USERS

// 00000000 CAN REFACTOR CALLER TO USE MODULAR CALLS
export async function postUser(sourceData, userId, username, createdAt, imageUrl, table = AIRTABLE_T_ALL_USERS) {
  console.log(`[${getTimestamp()}] TRYING: postUser from ${sourceData}`);
  try {
    const payload = {
      records: [
        {
          fields: {
            clerk_user_id: userId,
            username,
            created_at: String(createdAt),
            num_memes_rated: "0",
            points: "0",
            image_url: imageUrl,
          },
        },
      ],
    };

    const response = await fetch(`${AIRTABLE_URL}/${table}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      agent,
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to add user: ${response.status}: ${JSON.stringify(data)}`);
    }

    return {
      status: "success",
      records: data.records.map((record) => record.fields),
    };
  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

//111/////////////////////////////// --- UNRATED MEMES


// 00000000 CAN REFACTOR CALLER TO USE MODULAR CALLS
export async function getUnratedMemeCount(sourceData, table = AIRTABLE_T_UNRATED_MEMES) {
  console.log(`[${getTimestamp()}] TRYING: getUnratedMemeCount from ${sourceData}`);
  try {
    const url = `${AIRTABLE_URL}/${table}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    const data = await response.json();

    return {
      status: "success",
      count: data.records.length
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

// 00000000 CAN REFACTOR CALLER TO USE MODULAR CALLS
export async function uploadUnratedMemesToAirtable(sourceData, memeArray, table = AIRTABLE_T_UNRATED_MEMES) {
  console.log(`[${getTimestamp()}] TRYING: uploadUnratedMemesToAirtable from ${sourceData}`);
  try {
    const url = `${AIRTABLE_URL}/${table}`;

    // Transform memeArray into Airtable format
    const records = memeArray.map(meme => ({
      fields: {
        postLink: meme.postLink,
        subreddit: meme.subreddit,
        title: meme.title,
        url: meme.url,
        nsfw: String(meme.nsfw),
        spoiler: String(meme.spoiler),
        author: meme.author,
        ups: String(meme.ups),
        preview: String(meme.preview),
        created_at: String(Date.now())
      }
    }));

    console.log(`[${getTimestamp()}] uploadUnratedMemesToAirtable: UPLOADING:`)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records }),
      agent,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    console.log(`[${getTimestamp()}] uploadUnratedMemesToAirtable: UPLOADED:`)
    return {
      status: "success",
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

// 00000000 CAN REFACTOR CALLER TO USE MODULAR CALLS
export async function getUnratedMemesFromAirtable(sourceData, table = AIRTABLE_T_UNRATED_MEMES) {
  console.log(`[${getTimestamp()}] TRYING: getUnratedMemesFromAirtable from ${sourceData}`);
  try {
    const flagForSafetyReloop = false;
    
    let data;
    for (let i=0; i < 2; i++) {
      const url = `${AIRTABLE_URL}/${table}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        agent,
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }
      
      data = await response.json();

      if (data.records.length === 0 && flagForSafetyReloop) {
        throw new Error(`[${getTimestamp()}] getUnratedMemesFromAirtable: No memes found in Airtable`);
      }
      
      if (data.records.length === 0) {
        console.warn(`[${getTimestamp()}] getUnratedMemesFromAirtable: No memes found in Airtable`);
        //INSERT GET TEN MEMES WORKER TRIGGER, !!!!!!!!! TO BE MOVED TO CONTROLLER
        flagForSafetyReloop = true;
      } else {
        break
      }
    }
    
    console.log(`[${getTimestamp()}] getUnratedMemesFromAirtable: get SUCCESS`);
    return {
      status: "success",
      memes: data.records.map((record) => record.fields)
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

//222// PAGINATION INCLUDED
export async function getRatedMemes({ cursor = null, subredditFilter = [], pageSize = 5 }) {
  try {
    
    const url = new URL(`${AIRTABLE_URL}/${encodeURIComponent(AIRTABLE_T_RATED_MEMES)}`);

    url.searchParams.append("pageSize", pageSize);
    url.searchParams.append("sort[0][field]", "first_rated_at");
    url.searchParams.append("sort[0][direction]", "desc");

    let filters = [];
    
    if (cursor) {
      filters.push(`{first_rated_at} < ${cursor}`);
    }

    if (subredditFilter.length > 0) {
      const subFilter = subredditFilter.map(s => `{subreddit} = "${s}"`);
      filters.push(`OR(${subFilter.join(",")})`);
    }

    if (filters.length > 0) {
      url.searchParams.append(
        "filterByFormula",
        filters.length > 1 ? `AND(${filters.join(",")})` : filters[0]
      );
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
      agent,
    });

    if (!response.ok) {
      throw new Error(`Airtable responded with status ${response.status}`);
    }

    const data = await response.json();

    const records = data.records.map((record) => ({
      id: record.id, ...record.fields,
    }));

    const nextCursor = records.length > 0 ? String(records[records.length - 1].first_rated_at) : null;

    return {
      status: "success",
      records,
      cursor: nextCursor,
    };

  } catch (e) {
    console.error("Error in getRatedMemes:", e);
    throw e;
  }
  
}


//111/////////////////////////////// --- MODULAR FUNCTIONS

export async function getRecordsFromAirtable({
  table,
  sourceData,
  filterParams = {},
  fullData = false,
  } = {}) {
  
  console.log(`[${getTimestamp()}] TRYING: getRecordsFromAirtable from ${sourceData}`);
  try {
    const url = new URL(`${AIRTABLE_URL}/${table}`);

    //222// BUILD FILTER FORMULA
    if (filterParams && typeof filterParams === "object" && Object.keys(filterParams).length > 0) {
      const filterParts = Object.entries(filterParams).map(([key, value]) => {
        const formattedValue =
          typeof value === "string" ? `"${value}"` : value;
        return `{${key}} = ${formattedValue}`;
      });

      const formula =
        filterParts.length > 1
          ? `AND(${filterParts.join(", ")})`
          : filterParts[0];

      if (formula) {
        url.searchParams.append("filterByFormula", formula);
      }
    }

    //222// FETCH FROM AIRTABLE
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable error:", errorData.error?.message || "Unknown error");
      throw new Error(`Airtable API error: ${errorData.error?.message}`);
    }

    const data = await response.json();

    console.log(`[${getTimestamp()}] getRecordsFromAirtable: SUCCESS, retrieved ${data.records.length} record(s)`);

    return {
      status: "success",
      records: fullData ? data.records : data.records.map((record) => record.fields),
    };

  } catch (e) {
    console.error("getRecordsFromAirtable FAILED:", e.message);
    throw e;
  }
}

export async function postToAirtable({
  table,
  sourceData,
  postParams,
  } = {}) {

  console.log(`[${getTimestamp()}] TRYING: postToAirtable from ${sourceData}`);
  try {

    const url = new URL(`${AIRTABLE_URL}/${table}`);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: postParams,
          },
        ],
      }),
      agent,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable error:", errorData.error?.message || "Unknown error");
      throw new Error(`Airtable API error: ${errorData.error?.message}`);
    }

    const data = await response.json();
    console.log(`[${getTimestamp()}] postToAirtable: SUCCESS`);
    return {status: "success", data};
    
  } catch (e) {
    console.error("postToAirtable FAILED:", e.message);
    throw e;
  }
}

export async function deleteRecordsFromAirtable({
  table,
  sourceData,
  deleteParams = {},
  } = {}) {
  console.log(`[${getTimestamp()}] TRYING: deleteRecordsFromAirtable from ${sourceData}`);
    
  try {

    const url = new URL(`${AIRTABLE_URL}/${table}`);
    
    //222// BUILD FILTER FORMULA
    const filterParts = Object.entries(deleteParams).map(
      ([key, value]) => `{${key}} = ${typeof value === "string" ? `"${value}"` : value}`
    );
    const formula = filterParts.length > 1 ? `AND(${filterParts.join(", ")})` : filterParts[0];

    url.searchParams.append("filterByFormula", formula);

    //222// FIND MATCHING RECORDS
    const findResponse = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!findResponse.ok) {
      const errorData = await findResponse.json();
      throw new Error(`Airtable API error (find): ${errorData.error?.message}`);
    }

    const findData = await findResponse.json();
    const recordIds = findData.records.map((r) => r.id);

    if (recordIds.length === 0) {
      console.log(`[${getTimestamp()}] No records found for deletion`);
      return { status: "no_match", deleted: [] };
    }    

    //222// DELETE FOUND RECORDS BY RECORD ID
    const deleteUrl = new URL(`${AIRTABLE_URL}/${table}`);
    recordIds.forEach((id) => deleteUrl.searchParams.append("records[]", id));

    const deleteResponse = await fetch(deleteUrl.toString(), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(`Airtable API error (delete): ${errorData.error?.message}`);
    }

    const deleteData = await deleteResponse.json();
    console.log(`[${getTimestamp()}] deleteRecordsFromAirtable: SUCCESS, deleted ${deleteData.records.length} record(s)`);
    const deletedRecords = findData.records;
    return { status: "success", deletedRecords};

  } catch (e) {
    console.error("deleteRecordsFromAirtable FAILED:", e.message);
    throw e;
  }
}


export async function updateAirtableRecord({ table, recordId, fields }) {
  console.log(
    `[${getTimestamp()}] updateAirtableRecord: Updating ${recordId} in ${table}...`
  );

  try {
    const payload = {
      records: [
        {
          id: recordId,
          fields,
        },
      ],
    };

    const response = await fetch(`${AIRTABLE_URL}/${table}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      agent,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to update record: ${response.status} ${JSON.stringify(data)}`
      );
    }

    console.log(
      `[${getTimestamp()}] updateAirtableRecord: SUCCESS for ${recordId}`
    );
    return { status: "success", record: data.records[0] };
  } catch (e) {
    console.error(`[${getTimestamp()}] updateAirtableRecord: FAILED:`, e);
    throw e;
  }
}
