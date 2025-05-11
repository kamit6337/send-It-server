import redisClient from "../redisClient.js";

export const getUserIdFromRedis = async (secretToken) => {
  if (!secretToken) return null;

  const get = await redisClient.get(`User-Forgot-Password:${secretToken}`);

  return get;
};

export const setUserIdIntoRedis = async (
  secretToken,
  userId,
  time = 15 * 60 // 15 minutes
) => {
  if (!secretToken || !userId) return;

  await redisClient.set(
    `User-Forgot-Password:${secretToken}`,
    userId?.toString(),
    "EX",
    time
  );
};

export const deleteKeyFromRedis = async (secretToken) => {
  if (!secretToken) return;

  const deleted = await redisClient.del(`User-Forgot-Password:${secretToken}`);

  if (deleted === 0) {
    console.log("Key not found or already deleted");
  }

  return "Key successfully deleted";
};
