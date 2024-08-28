import redisClient from "../redisClient.js";

// NOTE: GETTING AND SETTNG AND SET SINGLE FOLLOWING, USER FOLLOWINGS (PAGINATION)
export const getCachedUserFollowings = async (userId, { limit, skip }) => {
  const get = await redisClient.get(`followingsData:${userId}`);
  if (!get) return false;
  const followings = JSON.parse(get).slice(skip, skip + limit);
  return followings;
};

export const setSingleUserFollowing = async (userId, obj) => {
  const get = await redisClient.get(`followingsData:${userId}`);

  if (!get) {
    await redisClient.set(
      `followingsData:${userId}`,
      JSON.stringify([obj]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `followingsData:${userId}`,
    JSON.stringify([obj, ...JSON.parse(get)]),
    "EX",
    3600
  );
};

export const setCachedUserFollwings = async (userId, data) => {
  const get = await redisClient.get(`followingsData:${userId}`);

  if (!get) {
    await redisClient.set(
      `followingsData:${userId}`,
      JSON.stringify(data),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `followingsData:${userId}`,
    JSON.stringify([...JSON.parse(get), ...data]),
    "EX",
    3600
  );
};

// NOTE: GETTING AND SETTNG USER FOLLOWERS (PAGINATION)
export const getCachedUserFollwers = async (userId, { limit, skip }) => {
  const get = await redisClient.get(`followersData:${userId}`);
  if (!get) return false;
  const followers = JSON.parse(get).slice(skip, skip + limit);
  return followers;
};

export const setCachedUserFollwers = async (userId, data) => {
  const get = await redisClient.get(`followersData:${userId}`);

  if (!get) {
    await redisClient.set(
      `followersData:${userId}`,
      JSON.stringify(data),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `followersData:${userId}`,
    JSON.stringify([...JSON.parse(get), ...data]),
    "EX",
    3600
  );
};

// NOTE: CHECK MY FOLLOWING, CREATE
export const checkMineFollowing = async (userId, followingId) => {
  const get = await redisClient.get(`mine-following:${userId}`);
  if (!get) return false;
  const findFollowing = JSON.parse(get).find(
    (obj) => obj.following === followingId
  );
  return findFollowing;
};

export const createMineFollowing = async (userId, followingId, exists) => {
  const findFollowings = await redisClient.get(`mine-following:${userId}`);

  const obj = {
    following: followingId,
    isExists: exists,
  };

  if (!findFollowings) {
    await redisClient.set(
      `mine-following:${userId}`,
      JSON.stringify([obj]),
      "EX",
      3600
    );
    return;
  }

  await redisClient.set(
    `mine-following:${userId}`,
    JSON.stringify([obj, ...JSON.parse(findFollowings)]),
    "EX",
    3600
  );
};

// NOTE: USER FOLLOWERS COUNT : GET, SET, INC, DEC
export const getUserFollowersCount = async (userId) => {
  const count = await redisClient.get(`FollowersCount:${userId}`);
  return count;
};

export const setUserFollowersCount = async (userId, amount) => {
  const count = await redisClient.set(`FollowersCount:${userId}`, amount);
  return count;
};

export const incUserFollowersCount = async (userId, amount = 1) => {
  const count = await redisClient.incrby(`FollowersCount:${userId}`, amount);
  return count;
};

export const decUserFollowersCount = async (userId, amount = 1) => {
  const count = await redisClient.decrby(`FollowersCount:${userId}`, amount);
  return count;
};

// NOTE: USER FOLLOWINGS COUNT : GET, SET, INC, DEC
export const getUserFollowingsCount = async (userId) => {
  const count = await redisClient.get(`FollowingsCount:${userId}`);
  return count;
};

export const setUserFollowingsCount = async (userId, amount) => {
  const count = await redisClient.set(`FollowingsCount:${userId}`, amount);
  return count;
};

export const incUserFollowingsCount = async (userId, amount = 1) => {
  const count = await redisClient.incrby(`FollowingsCount:${userId}`, amount);
  return count;
};

export const decUserFollowingsCount = async (userId, amount = 1) => {
  const count = await redisClient.decrby(`FollowingsCount:${userId}`, amount);
  return count;
};
