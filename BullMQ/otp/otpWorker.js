import { Worker } from "bullmq";
import otpTemplate from "../../utils/email/otpTemplate.js";
import sendingEmail from "../../utils/email/email.js";
import redisClient from "../../redis/redisClient.js";

// Create a worker to process the 'sendOTP' job
const otpWorker = new Worker(
  "otpQueue",
  async (job) => {
    try {
      console.log(`Processing job: ${job.id}`); // Add this line to confirm job is being processed

      const { email, otp } = job.data;
      const html = otpTemplate(otp);
      await sendingEmail(email, "OTP for verification", html);

      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw error; // Rethrow to ensure job retries if needed
    }
  },
  {
    connection: redisClient,
  }
);

export default otpWorker;
