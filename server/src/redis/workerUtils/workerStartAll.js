import { startGetTenMemesWorker } from "../workers/getTenMemesWorker.js";

export function workerStartAll(redisConnection) {
  startGetTenMemesWorker(redisConnection);
}