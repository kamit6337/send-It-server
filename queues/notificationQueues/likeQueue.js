import { Queue } from "bullmq";
import redisClient, { createWorkerRedis } from "../../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = createWorkerRedis();

const likeQueue = new Queue("like-batch", { connection: bullConnection });

export const addLikeJob = async (userId, sender, post) => {
  if (!userId || !sender || !post) {
    throw new Error("UserId or Sender or Post is not provided");
  }

  const key = `like-timer:${userId}`;
  const exists = await redisClient.exists(key);

  // Add follower to Redis list
  await redisClient.lpush(
    `like-batch-list:${userId}`,
    JSON.stringify({ sender, post })
  );

  await redisClient.sadd(`like-unqiue-postId:${userId}`, post._id);

  if (!exists) {
    // Set a TTL key to ensure only one job per 5 minutes
    await redisClient.set(key, "1", "EX", 60); // 5 mins TTL

    await redisClient.expire(`like-batch-list:${userId}`, 3 * 60);
    await redisClient.expire(`like-unqiue-postId:${userId}`, 3 * 60);

    await likeQueue.add(
      `notify-${userId}`,
      { userId },
      {
        delay: 1 * 60 * 1000,
      }
    );
  }
};
