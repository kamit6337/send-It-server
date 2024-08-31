import redisClient from "../redisClient.js";

export const getCachedUserLikedPosts = async ({ skip, limit }) => {
  const get = await redisClient.get(`user-liked-posts`);
  if (!get) return false;
  const userPosts = JSON.parse(get).slice(skip, skip + limit);
  return userPosts;
};

export const setUserLikedPosts = async (data) => {
  const get = await redisClient.get(`user-liked-posts`);

  if (!get) {
    await redisClient.set(`user-liked-posts`, JSON.stringify(data), "EX", 3600);
    return;
  }

  await redisClient.set(
    `user-liked-posts`,
    JSON.stringify([...JSON.parse(get), ...data]),
    "EX",
    3600
  );
};

export const setSingleUserLikedPost = async (data) => {
  const get = await redisClient.get(`user-liked-posts`);

  if (!get) {
    await redisClient.set(
      `user-liked-posts`,
      JSON.stringify([data]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `user-liked-posts`,
    JSON.stringify([data, ...JSON.parse(get)]),
    "EX",
    3600
  );
};

export const delSingleUserLikedPost = async (postId) => {
  const get = await redisClient.get(`user-liked-posts`);

  if (!get) return;

  const updateList = JSON.parse(get).filter((obj) => obj._id !== postId);

  await redisClient.set(
    `user-liked-posts`,
    JSON.stringify([...updateList]),
    "EX",
    3600
  );
};
