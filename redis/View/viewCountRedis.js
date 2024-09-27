import redisClient from "../redisClient.js";

export const isPostIdPresent = async (postId) => {
  const check = await redisClient.sismember(`view-count`, postId);
  return !!check;
};

export const addPostId = async (postId) => {
  await redisClient.sadd(`view-count`, postId);
  await redisClient.expire(`view-count`, 3600);
};
