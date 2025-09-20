export function workerEventListeners(workerName, workerInstance) {
  const handleWorkerEvent = (event, ...args) => {
    switch (event) {
      case "completed":
        const [job, result] = args;
        console.log(`[${workerName}] Job ${job.id} completed. Result:`, result);
        break;
      case "failed":
        const [jobFailed, err] = args;
        console.error(`[${workerName}] Job ${jobFailed.id} failed:`, err);
        break;
      case "stalled":
        const [jobStalled] = args;
        console.warn(`[${workerName}] Job ${jobStalled.id} stalled!`);
        break;
      case "active":
        const [jobActive] = args;
        console.log(`[${workerName}] Job ${jobActive.id} started.`);
        break;
      case "waiting":
        const [jobId] = args;
        console.log(`[${workerName}] Job ${jobId} is waiting.`);
        break;
      default:
        console.warn(`[${workerName}] Unhandled event: ${event}`);
    }
  };

  ["completed", "failed", "stalled", "active", "waiting"].forEach((event) => {
    workerInstance.on(event, (...args) => handleWorkerEvent(event, ...args));
  });
}
