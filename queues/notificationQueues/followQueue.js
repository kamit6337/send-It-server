import { Queue, Worker } from "bullmq";
import redisClient from "../../redis/redisClient.js";
import socketConnect from "../../lib/socketConnect.js";
import Notification from "../../models/NotificationModel.js";
import uniqueObjectFromArray from "../../utils/javaScript/uniqueObjectFromArray.js";

// BullMQ connection — don't use this for native Redis commands
const bullConnection = redisClient.duplicate();

const followQueue = new Queue("follow-batch", { connection: bullConnection });

export const addFollowJob = async (userId, follower) => {
  const key = `follow-timer:${userId}`;
  const exists = await redisClient.exists(key);

  console.log("userId", userId);
  console.log("follower", follower);

  // Add follower to Redis list
  await redisClient.lpush(
    `follow-batch-list:${userId}`,
    JSON.stringify(follower)
  );

  if (!exists) {
    // Set a TTL key to ensure only one job per 5 minutes
    await redisClient.set(key, "1", "EX", 30); // 5 mins TTL

    await followQueue.add(`notify-${userId}`, { userId }, { delay: 30 * 1000 });
  }
};

// Worker to process batch after 5 minutes
const worker = new Worker(
  "follow-batch",
  async (job) => {
    const { userId } = job.data;
    const { io } = socketConnect();

    const key = `follow-batch-list:${userId}`;

    const followersRaw = await redisClient.lrange(key, 0, -1);
    const followers = followersRaw.map(JSON.parse);

    if (followers.length > 0) {
      const uniqueFollowers = uniqueObjectFromArray(followers);

      const followerIds = uniqueFollowers.map((follower) => follower._id);

      const newNotification = await Notification.create({
        user: userId,
        sender: followerIds,
        type: "follow",
      });

      console.log(`[Worker] Sent follow notification to user ${userId}`);

      io.to(userId).emit("notification", {
        type: "follow",
        message: `${followers.length} new user(s) followed you.`,
        sender: followers,
      });

      await redisClient.del(key);
    }
  },
  { connection: bullConnection }
);

// --- Worker Events ---
worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job.id} failed:`, err);
});

worker.on("error", (err) => {
  console.error(`[Worker] Worker error:`, err);
});

console.log("[Worker] Follow batch worker started");
