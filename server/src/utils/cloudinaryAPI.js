
export async function postCloudinary(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: postCloudinary from ${sourceData}`);
  try {
    return {
      status: "success"
    }
  } catch (e) {
    console.error("Airtable failed:", e.message);
    throw e;
  }
}