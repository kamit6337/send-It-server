import { Worker } from "bullmq";
import redisClient from "../../redis/redisClient.js";
import Notification from "../../models/NotificationModel.js";
import { sendNewNotificationIO } from "../../socketIO/notification.js";

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    try {
      const { type, user, sender } = job.data;

      const { _id } = sender;

      const obj = {
        type,
        user,
        sender: _id,
      };

      if (type === "like") {
        obj.post = job.data.post;
      }

      const create = await Notification.create({
        ...obj,
      });

      const newObj = {
        ...job.data,
        _id: create._id,
      };

      sendNewNotificationIO(user, newObj);
    } catch (error) {
      console.log("Error from Notification Worker");
      throw error;
    }
  },
  {
    connection: redisClient,
  }
);

export default notificationWorker;
