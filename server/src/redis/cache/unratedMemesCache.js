// import redis from '../connection.js';

// export async function getMemeCache(key) {
//   const value = await redis.get(key);
//   return value ? JSON.parse(value) : null;
// }

// export async function setMemeCache(key, data, ttl) {
//   if (ttl) {
//     await redis.set(key, JSON.stringify(data), 'EX', ttl);
//   } else {
//     await redis.set(key, JSON.stringify(data));
//   }
// }