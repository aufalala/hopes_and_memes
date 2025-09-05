import { AIRTABLE_URL, AIRTABLE_TOKEN } from "../config.js";

//111/////////////////////////////// --- PING 
export async function pingAirtable(table = "testTable") {

  try {
    const response = await fetch(`${AIRTABLE_URL}/${table}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return { status: "success", message: "Proxy connected to Airtable" };
  } catch (err) {
    console.error("Airtable ping failed:", err.message);
    return { status: "failed", message: err.message };
  }
}

//111/////////////////////////////// --- TEST
export async function getTestImage(username = "aufalala", table = "imageTest") {

  try {
    const filterFormula = encodeURIComponent(`{username} = "${username}"`);
    const url = `${AIRTABLE_URL}/${table}?filterByFormula=${filterFormula}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
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



//111/////////////////////////////// --- ALL MEMES



//111/////////////////////////////// --- ALL RATINGS