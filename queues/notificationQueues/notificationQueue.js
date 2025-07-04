import { Queue } from "bullmq";
import redisClient, { createWorkerRedis } from "../../redis/redisClient.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = createWorkerRedis();

const notificationQueue = new Queue("notification-batch", {
  connection: bullConnection,
});

const notificationTypes = ["follower", "like", "reply"];

export const addNotificationJob = async (userId, notificationType, data) => {
  if (!notificationTypes.includes(notificationType)) {
    throw new Error("Wrong Notification type");
  }

  if (!data) throw new Error("Data not provided for Notification");

  const key = `${notificationType}-timer:${userId}`;
  const exists = await redisClient.exists(key);

  // Add Data to Redis list
  await redisClient.lpush(
    `${notificationType}-batch-list:${userId}`,
    JSON.stringify(data)
  );

  if (notificationType === "like" || notificationType === "reply") {
    await redisClient.sadd(
      `${notificationType}-unqiue-postId:${userId}`,
      data?.post._id
    );
  }

  if (!exists) {
    // Set a TTL key to ensure only one job per 1 minutes
    await redisClient.set(key, "1", "EX", 60); // 1 mins TTL

    await redisClient.expire(
      `${notificationType}-batch-list:${userId}`,
      3 * 60 // 3 mins
    );

    if (notificationType === "like" || notificationType === "reply") {
      await redisClient.expire(
        `${notificationType}-unqiue-postId:${userId}`,
        3 * 60 // 3 mins
      );
    }

    await notificationQueue.add(
      `notification-${notificationType}`,
      { userId },
      {
        delay: 1 * 60 * 1000,
      }
    );
  }
};
