import { Queue } from "bullmq";
import redisClient from "../../redis/redisClient.js";

// Create a BullMQ queue for OTP emails
const notificationQueue = new Queue("notificationQueue", {
  connection: redisClient,
});

// Enqueue the job to send OTP email
export const sendNotificationAsync = async (type, user, sender, obj = {}) => {
  try {
    if (user === sender._id) return;

    await notificationQueue.add(
      "sendNotification",
      { type, user, sender, ...obj },
      { attempts: 3, backoff: 5000 }
    );
  } catch (error) {
    throw error;
  }
};

export default notificationQueue;
