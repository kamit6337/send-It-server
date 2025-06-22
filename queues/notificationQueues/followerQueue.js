import { Queue } from "bullmq";
import redisClient, { createWorkerRedis } from "../../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = createWorkerRedis();

const followQueue = new Queue("follow-batch", { connection: bullConnection });

export const addFollowJob = async (userId, follower) => {
  const key = `follow-timer:${userId}`;
  const exists = await redisClient.exists(key);

  // Add follower to Redis list
  await redisClient.lpush(
    `follow-batch-list:${userId}`,
    JSON.stringify(follower)
  );

  if (!exists) {
    // Set a TTL key to ensure only one job per 5 minutes
    await redisClient.set(key, "1", "EX", 60); // 5 mins TTL

    await redisClient.expire(`follow-batch-list:${userId}`, 3 * 60);

    await followQueue.add(
      `notify-${userId}`,
      { userId },
      {
        delay: 1 * 60 * 1000,
      }
    );
  }
};
