import redisClient from "../redisClient.js";

export const getUserByIdRedis = async (userId) => {
  const get = await redisClient.get(`User-Id:${userId}`);
  return get ? JSON.parse(get) : null;
};

export const getUserByEmailRedis = async (email) => {
  const userId = await redisClient.get(`User-Email:${email}`);

  if (!userId) return null;

  return getUserByIdRedis(userId);
};

export const setUserIntoRedis = async (user) => {
  if (!user) return;

  await redisClient.set(
    `User-Id:${user._id.toString()}`,
    JSON.stringify(user),
    "EX",
    3600
  );

  await redisClient.set(
    `User-Email:${user.email}`,
    user._id.toString(),
    "EX",
    3600
  );
};
