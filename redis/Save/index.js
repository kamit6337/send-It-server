import redisClient from "../redisClient.js";

// NOTE: CHECK MY FOLLOWING, CREATE AND REMOVE
// Check if user is following the given followingId
export const checkPostSave = async (userId, postId) => {
  const get = await redisClient.get(`mine-save-post:${userId}`);
  if (!get) return false;
  const findPost = JSON.parse(get).find((obj) => obj.post === postId);
  return findPost;
};

// Add postId to the user's following list
export const createPostSave = async (userId, postId, saved) => {
  const findPost = await redisClient.get(`mine-save-post:${userId}`);

  const obj = {
    post: postId,
    isSaved: saved,
  };

  if (!findPost) {
    await redisClient.set(
      `mine-save-post:${userId}`,
      JSON.stringify([obj]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `mine-save-post:${userId}`,
    JSON.stringify([obj, ...JSON.parse(findPost)]),
    "EX",
    3600
  );
};

export const updatePostSave = async (userId, postId, Save) => {
  const findPost = await checkPostSave(userId, postId);

  if (!findPost) {
    await createPostSave(userId, postId, Save);
    return;
  }

  const get = await redisClient.get(`mine-save-post:${userId}`);

  const allPosts = JSON.parse(get);

  const updateSinglePost = allPosts.map((obj) => {
    if (obj.post === postId) {
      const newObj = {
        ...obj,
        isSaved: Save,
      };
      return newObj;
    }
    return obj;
  });

  await redisClient.set(
    `mine-save-post:${userId}`,
    JSON.stringify([...updateSinglePost]),
    "EX",
    3600
  );
};
