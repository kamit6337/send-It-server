import redisClient from "../redisClient.js";

// NOTE: GET REQUEST
export const getCacheUserFromId = async (id) => {
  const cacheUser = await redisClient.get(`user:${id}`);
  return cacheUser ? JSON.parse(cacheUser) : null;
};

export const getCacheUserFromUsername = async (username) => {
  const cacheUser = await redisClient.get(`user:${username}`);
  return cacheUser ? JSON.parse(cacheUser) : null;
};

// NOTE: SET REQUEST
export const setUserWithIdToCache = async (user) => {
  await redisClient.set(`user:${user._id}`, JSON.stringify(user), "EX", 3600); // Expires in 1 hour
};

export const setUserWithUsernameToCache = async (user) => {
  await redisClient.set(
    `user:${user.username}`,
    JSON.stringify(user),
    "EX",
    3600
  ); // Expires in 1 hour
};
