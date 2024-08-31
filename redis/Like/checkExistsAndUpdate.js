import redisClient from "../redisClient.js";

export const checkPostLike = async (userId, postId) => {
  const get = await redisClient.get(`mine-like-post:${userId}`);
  if (!get) return false;
  const findPost = JSON.parse(get).find((obj) => obj.post === postId);
  return findPost;
};

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

export const updatePostLike = async (userId, postId, like) => {
  const findPost = await checkPostLike(userId, postId);

  if (!findPost) {
    await createPostLike(userId, postId, like);
    return;
  }

  const get = await redisClient.get(`mine-like-post:${userId}`);

  const allPosts = JSON.parse(get);

  const updateSinglePost = allPosts.map((obj) => {
    if (obj.post === postId) {
      const newObj = {
        ...obj,
        isLiked: like,
      };
      return newObj;
    }
    return obj;
  });

  await redisClient.set(
    `mine-like-post:${userId}`,
    JSON.stringify([...updateSinglePost]),
    "EX",
    3600
  );
};
