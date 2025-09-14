import { AIRTABLE_URL, AIRTABLE_TOKEN } from "../config.js";

//111/////////////////////////////// --- PING 
async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

//////////////////// force IPv4 /////////////////
import https from 'https';
import fetch from 'node-fetch';
const agent = new https.Agent({ family: 4 });
////////////////////////////////////////////////


export async function pingAirtable(table = "testTable", retries = 3) {
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
export async function getTestImage(username = "aufalala", table = "imageTest") {

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

  } catch (err) {
    
    console.error("Airtable fetch failed:", err.message);
  }
}

//111/////////////////////////////// --- ALL USERS


export async function getUserVerify(userId, table = "allUsers") {

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

  } catch (err) { 
    console.error("Airtable fetch failed:", err.message);
  }
}

export async function postUser(userId, username, createdAt, table = "allUsers") {
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
}




//111/////////////////////////////// --- ALL MEMES


export async function getUnratedMemeCount(table = "unratedMemes") {
  console.log("trying getUnratedMemeCount")
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

  } catch (err) {
    console.error("Airtable fetch failed:", err.message);
  }
}




//111/////////////////////////////// --- ALL RATINGS