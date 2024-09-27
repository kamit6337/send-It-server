import notificationWorker from "./BullMQ/notification/notificationWorker.js";
import otpWorker from "./BullMQ/otp/otpWorker.js";

console.log("OTP Worker is starting..."); // Add this line at the top of otpWorker.js

// Optional: Log when the worker starts
otpWorker.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

otpWorker.on("failed", (job, err) => {
  console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

otpWorker.on("error", (err) => {
  console.error(`Worker encountered an error: ${err.message}`);
});

// Optional: Log when the worker starts
notificationWorker.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

notificationWorker.on("error", (err) => {
  console.error(`Worker encountered an error: ${err.message}`);
});

// Keep the process alive
setInterval(() => {}, 1 << 30); // Optional: This keeps the node process alive
