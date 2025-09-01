import { AIRTABLE_URL, AIRTABLE_TOKEN } from "../config.js";

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
