
// "dev": "concurrently \"redis-server\" \"nodemon src/server.js\""

//111/////////////////////////////// --- ASDADSA 


//222// 





router.get("/PATH/PATH/PATH", async (req, res) => {
  const sourceData = `${req.method} ${req.originalUrl} from ${req.ip}`;
  console.log(`[${new Date().toISOString()}] CLIENT REACHED: ${sourceData}`);
  try {
    const result = await ##FUNCTION##();

    if (result.status === "success") {
      return res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e.message);
  }
});



export async function ##FUNCTION##(sourceData) {
  console.log(`[${new Date().toISOString()}] TRYING: ##FUNCTION## from ${sourceData}`);
  try {
    return {
      status: "success"
    }
  } catch (e) {
    console.error("##API failed:##", e.message);
    throw e;
  }
}



const ##WORKER## = new Worker(
  "##JOB NAME##",
  async (job) => {
    console.log("Starting job", job.name, job.id);
    const { sourceData } = job.data;
    try {
      const result = await ##FUNCTION1#(sourceData);
      if (result.status !== "success") {
        throw new Error("##FUNCTION1## failed: status not success");
      } else {

          try {
            const result2 = await ##FUNCTION2##(sourceData);
            if (result.status !== "success") {
              throw new Error("##FUNCTION2## failed: status not success");
            }
            return result2;

          } catch (e) {
            console.error("##FUNCTION2## error:", e);
            throw e;
          }
      }

    } catch (e) {
      console.error("##FUNCTION1## or ##FUNCTION2## failed:", e);
      throw e;
    }
  },
  { connection }
);
