import { Queue } from "bullmq";
import redisClient, { createWorkerRedis } from "../../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = createWorkerRedis();

const chatQueue = new Queue("chat-batch", { connection: bullConnection });

export const addChatJob = async (roomId) => {
  const key = `chat-timer:${roomId}`;
  const exists = await redisClient.exists(key);

  if (!exists) {
    // Set a TTL key to ensure only one job per 1 minutes
    await redisClient.set(key, "1", "EX", 2 * 60); // 2 mins TTL

    await chatQueue.add(
      `notify-${roomId}`,
      { roomId },
      {
        delay: 2 * 60 * 1000, // 2 mins
      }
    );
  }
};
