import { AIRTABLE_URL, AIRTABLE_TOKEN } from "../config.js";

//111/////////////////////////////// --- FORCE IPV4
import https from "https";
import fetch from "node-fetch";
const agent = new https.Agent({ family: 4 });

//111/////////////////////////////// --- FOR PING 
async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

//111/////////////////////////////// --- PING

export async function pingAirtable(sourceData, table = "testTable", retries = 3) {
  console.log(`[${new Date().toISOString()}] TRYING: pingAirtable from ${sourceData}`);
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
      if (i < retries) await delay(1000); // wait 1 second before retry
    }
  }

  return { status: "failed", message: "Airtable unreachable after retries" };
}

//111/////////////////////////////// --- TEST
export async function getTestImage(sourceData, username = "aufalala", table = "imageTest") {
  console.log(`[${new Date().toISOString()}] TRYING: getTestImage from ${sourceData}`);
  try {
    const filterFormula = encodeURIComponent(`{username} = "${username}"`);
    const url = `${AIRTABLE_URL}/${table}?filterByFormula=${filterFormula}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data.records.length) {
      throw new Error(`No record found for username: ${username}`);
    }

    const imageUrl = data.records[0]?.fields?.image?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image found for user");
    }

    return {
      status: "success",
      imageUrl,
      message: `Image found for user ${username}`,
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

//111/////////////////////////////// --- ALL USERS


export async function getUserVerify(sourceData, userId, table = "allUsers") {
  console.log(`[${new Date().toISOString()}] TRYING: getUserVerify ${sourceData}`);
  try {
    const filterFormula = encodeURIComponent(`{clerk_user_id} = "${userId}"`);
    const url = `${AIRTABLE_URL}/${table}?filterByFormula=${filterFormula}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,  
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }
    
    const data = await response.json();
    let exist = true;

    if (!data.records.length) {
      exist = false;
    }
    
    return {
      status: "success",
      exist,
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

export async function postUser(sourceData, userId, username, createdAt, table = "allUsers") {
  console.log(`[${new Date().toISOString()}] TRYING: postUser from ${sourceData}`);
  try {
    const payload = {
      records: [
        {
          fields: {
            clerk_user_id: userId,
            username,
            created_at: createdAt,
            num_memes_rated: 0,
            points: 0,
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
      throw new Error(`Failed to add user: ${response.status}: ${data}`);
    }

    return {
      status: "success",
      record: data.records[0],
    };
  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

// export async function getUserVerify(sourceData, userId, table = "allUsers") {
//   console.log(`[${new Date().toISOString()}] TRYING: getUserVerify ${sourceData}`);
//   try {
//     const filterFormula = encodeURIComponent(`{clerk_user_id} = "${userId}"`);
//     const url = `${AIRTABLE_URL}/${table}?filterByFormula=${filterFormula}`;
    
//     const response = await fetch(url, {
//       headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
//       agent,  
//     });

//     if (!response.ok) {
//       throw new Error(`Airtable API error: ${response.status}`);
//     }
    
//     const data = await response.json();
//     let exist = true;

//     if (!data.records.length) {
//       exist = false;
//     }
    
//     return {
//       status: "success",
//       exist,
//     };

//   } catch (e) {
//     console.error("Airtable failed:", e.message);
//     throw e;
//   }
// }



//111/////////////////////////////// --- UNRATED MEMES


export async function getUnratedMemeCount(sourceData, table = "unratedMemes") {
  console.log(`[${new Date().toISOString()}] TRYING: getUnratedMemeCount from ${sourceData}`);
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

export async function uploadUnratedMemesToAirtable(sourceData, memeArray, table = "unratedMemes") {
  console.log(`[${new Date().toISOString()}] TRYING: uploadUnratedMemesToAirtable from ${sourceData}`);
  try {
    const url = `${AIRTABLE_URL}/${table}`;

    // Transform memeArray into Airtable format
    const records = memeArray.map(meme => ({
      fields: {
        postLink: meme.postLink,
        subreddit: meme.subreddit,
        title: meme.title,
        url: meme.url,
        nsfw: JSON.stringify(meme.nsfw),
        spoiler: JSON.stringify(meme.spoiler),
        author: meme.author,
        ups: JSON.stringify(meme.ups),
        preview: JSON.stringify(meme.preview),
        created_at: JSON.stringify(Date.now())
      }
    }));

    console.log(`[${new Date().toISOString()}] uploadUnratedMemesToAirtable: UPLOADING:`)
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

    console.log(`[${new Date().toISOString()}] uploadUnratedMemesToAirtable: UPLOADED:`)
    return {
      status: "success",
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

export async function getUnratedMemesFromAirtable(sourceData, table = "unratedMemes") {
  console.log(`[${new Date().toISOString()}] TRYING: getUnratedMemesFromAirtable from ${sourceData}`);
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
        throw new Error(`[${new Date().toISOString()}] getUnratedMemesFromAirtable: No memes found in Airtable`);
      }
      
      if (data.records.length === 0) {
        console.warn(`[${new Date().toISOString()}] getUnratedMemesFromAirtable: No memes found in Airtable`);
        //INSERT GET TEN MEMES WORKER TRIGGER, !!!!!!!!! TO BE MOVED TO CONTROLLER
        flagForSafetyReloop = true;
      } else {
        break
      }
    }
    
    console.log(`[${new Date().toISOString()}] getUnratedMemesFromAirtable: get SUCCESS`);
    return {
      status: "success",
      memes: data.records.map((record) => record.fields)
    };

  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}

//asdalskdkalsdklasdlskahdkashlkasdkhaskhdsa

export async function getRecordsFromAirtable({
  table,
  sourceData,
  filterParams = {},
} = {}) {
  console.log(`[${new Date().toISOString()}] TRYING: getRecordsFromAirtable from table: ${table}, from ${sourceData}`);

  try {
    const url = new URL(`${AIRTABLE_URL}/${table}`);

    // Build Airtable filterByFormula from filterParams
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

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      agent,
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();

    console.log(`[${new Date().toISOString()}] getRecordsFromAirtable: SUCCESS, retrieved ${data.records.length} record(s)`);

    return {
      status: "success",
      records: data.records.map((record) => record.fields),
    };

  } catch (e) {
    console.error("getRecordsFromAirtable FAILED:", e.message);
    throw e;
  }
}



//111/////////////////////////////// --- ALL RATINGS

// export async function uploadUnratedRating(sourceData) {
//   console.log(`[${new Date().toISOString()}] TRYING: uploadUnratedRating from ${sourceData}`);
//   try {
//     const url = `${AIRTABLE_URL}/${table}`;

//     return {
//       status: "success"
//     }
//   } catch (e) {
//     console.error("##API failed:##", e.message);
//     throw e;
//   }
// }