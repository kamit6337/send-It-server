import redisClient from "../redisClient.js";

export const getCacheSinglePost = async (postId) => {
  // NOTE: CHECK IN USER POSTS
  const userPosts = await redisClient.get(`user-posts`);
  if (!userPosts) return false;
  const findPost = JSON.parse(userPosts).find((obj) => obj._id === postId);
  if (findPost) return findPost;

  // NOTE: CHECK IN USER LIKED POSTS
  const userLikedPosts = await redisClient.get(`user-liked-posts`);
  if (!userLikedPosts) return false;
  const findPostInLikedPosts = JSON.parse(userPosts).find(
    (obj) => obj._id === postId
  );
  if (findPostInLikedPosts) return findPost;

  // NOTE: CHECK IN SINGLE POSTS
  const get = await redisClient.get(`single-post:${postId}`);
  return get ? JSON.parse(get) : null;
};

export const setCacheSinglePost = async (postId, data) => {
  await redisClient.set(
    `single-post:${postId}`,
    JSON.stringify(data),
    "EX",
    3600
  );
};
