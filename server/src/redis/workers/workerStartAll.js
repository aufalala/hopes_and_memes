import { startGetTenMemesWorker } from "./getTenMemesWorker.js";

export function workerStartAll(redisConnection) {
  startGetTenMemesWorker(redisConnection);
}