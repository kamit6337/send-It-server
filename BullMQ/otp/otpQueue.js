import { Queue } from "bullmq";
import redisClient from "../../redis/redisClient.js";

// Create a BullMQ queue for OTP emails
const otpQueue = new Queue("otpQueue", {
  connection: redisClient,
});

// Enqueue the job to send OTP email
export const sendEmailAsync = async (email, otp) => {
  try {
    await otpQueue.add(
      "sendOTP",
      { email, otp },
      { attempts: 3, backoff: 5000 }
    );
  } catch (error) {
    throw error;
  }
};

export default otpQueue;
