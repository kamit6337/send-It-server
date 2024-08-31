import redisClient from "../redisClient.js";

// NOTE: GET AND SET USER POSTS
export const getCachedUserPosts = async (page) => {
  const get = await redisClient.get(`user-posts:${page}`);
  return get ? JSON.parse(get) : null;
};

export const setUserPosts = async (page, data) => {
  await redisClient.get(`user-posts:${page}`, JSON.stringify(data));
};

export const getAllUserPostsWithPages = async () => {
  const keys = [];
  let cursor = "0";

  // Use SCAN to get all keys matching the pattern 'user-posts:*'
  do {
    const result = await redisClient.scan(cursor, "MATCH", "user-posts:*");
    cursor = result[0]; // Update the cursor
    keys.push(...result[1]); // Append found keys to the keys array
  } while (cursor !== "0"); // Continue until cursor returns to '0'

  // Prepare a multi command to fetch all the values for the found keys
  const multi = redisClient.multi();
  keys.forEach((key) => multi.get(key));
  const values = await multi.exec();

  // Combine keys with their corresponding values
  const userPosts = keys.map((key, index) => {
    const page = key.split(":")[1]; // Extract the page number from the key
    const value = values[index][1]; // Get the value from the multi result
    return {
      page,
      posts: value ? JSON.parse(value) : null, // Parse the value if it exists
    };
  });

  return userPosts;
};
// [
//   { "page": "1", "posts": [{...}, {...}] },
//   { "page": "2", "posts": [{...}] },
//   { "page": "3", "posts": null }
// ]

export const setSingleUserPost = async (data) => {
  const get = await getCachedUserPosts(1);

  if (!get) {
    await redisClient.set(`user-posts:1`, JSON.stringify([data]), "EX", 3600);
    return;
  }

  await redisClient.set(
    `user-posts:1`,
    JSON.stringify([data, ...get]),
    "EX",
    3600
  );
};
