import redisConnection from '../connection.js';

export async function getMemeCache(key) {
  const value = await redisConnection.get(key);
  return value ? JSON.parse(value) : null;
}

export async function setMemeCache(key, data, ttl) {
  if (ttl) {
    await redisConnection.set(key, JSON.stringify(data), 'EX', ttl);
  } else {
    await redisConnection.set(key, JSON.stringify(data));
  }
}