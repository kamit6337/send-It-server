import redisClient from "../redisClient.js";

// NOTE: CHECK MY FOLLOWING, CREATE AND REMOVE
// Check if user is following the given followingId
export const checkPostLike = async (userId, postId) => {
  const get = await redisClient.get(`mine-like-post:${userId}`);
  if (!get) return false;
  const findPost = JSON.parse(get).find((obj) => obj.post === postId);
  return findPost;
};

// Add postId to the user's following list
export const createPostLike = async (userId, postId, liked) => {
  const findPost = await redisClient.get(`mine-like-post:${userId}`);

  const obj = {
    post: postId,
    isLiked: liked,
  };

  if (!findPost) {
    await redisClient.set(
      `mine-like-post:${userId}`,
      JSON.stringify([obj]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `mine-like-post:${userId}`,
    JSON.stringify([obj, ...JSON.parse(findPost)]),
    "EX",
    3600
  );
};
