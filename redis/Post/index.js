import redisClient from "../redisClient.js";

// NOTE: GET AND SET USER FOLLOWING POSTS
export const getCachedUserFollowingPosts = async (userId, { limit, skip }) => {
  const get = await redisClient.get(`followingPosts:${userId}`);
  if (!get) return false;
  const posts = JSON.parse(get).slice(skip, skip + limit);
  return posts;
};

export const setCachedUserFollowingPosts = async (userId, data) => {
  const get = await redisClient.get(`followingPosts:${userId}`);

  if (!get) {
    await redisClient.set(
      `followingPosts:${userId}`,
      JSON.stringify(data),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `followingPosts:${userId}`,
    JSON.stringify([...JSON.parse(get), ...data]),
    "EX",
    3600
  );
};

// NOTE: GET AND SET USER POSTS
export const getCachedUserPosts = async (userId, { skip, limit }) => {
  const get = await redisClient.get(`user-posts:${userId}`);
  if (!get) return false;
  const userPosts = JSON.parse(get).slice(skip, skip + limit);
  return userPosts;
};

export const setUserPosts = async (userId, data) => {
  const get = await redisClient.get(`user-posts:${userId}`);

  if (!get) {
    await redisClient.set(
      `user-posts:${userId}`,
      JSON.stringify(data),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `user-posts:${userId}`,
    JSON.stringify([...JSON.parse(get), ...data]),
    "EX",
    3600
  );
};

// NOTE: GET AND SET POST DETAILS
export const getCachedPostDetails = async (id) => {
  const post = await redisClient.get(`post-details:${id}`);
  return post ? JSON.parse(post) : null;
};

export const setPostDetails = async (id, post) => {
  const setPost = await redisClient.set(
    `post-details:${id}`,
    JSON.stringify(post),
    "EX",
    3600
  );
  return setPost;
};
