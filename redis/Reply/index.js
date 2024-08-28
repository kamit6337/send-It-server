import redisClient from "../redisClient.js";

// NOTE: CHECK MY FOLLOWING, CREATE AND REMOVE
// Check if user is following the given followingId
export const checkPostReply = async (userId, postId) => {
  const get = await redisClient.get(`mine-post-reply:${userId}`);
  if (!get) return false;
  const findPost = JSON.parse(get).find((obj) => obj.post === postId);
  return findPost;
};

// Add postId to the user's following list
export const createPostReply = async (userId, postId, replied) => {
  const findPost = await redisClient.get(`mine-post-reply:${userId}`);

  const obj = {
    post: postId,
    isReplied: replied,
  };

  if (!findPost) {
    await redisClient.set(
      `mine-post-reply:${userId}`,
      JSON.stringify([obj]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `mine-post-reply:${userId}`,
    JSON.stringify([obj, ...JSON.parse(findPost)]),
    "EX",
    3600
  );
};
