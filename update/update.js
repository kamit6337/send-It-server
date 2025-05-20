import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import Like from "../models/LikeModel.js";
import Save from "../models/SaveModel.js";
import Follower from "../models/FollowerModel.js";
import Notification from "../models/NotificationModel.js";

mongoose.connect(environment.MONGO_DB_URI);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Handle connection events
mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  try {
    // const deleteAllNotification = await Notification.deleteMany({
    //   totalSenders: null,
    // });
    // const deleteAllPost = await Post.deleteMany();
    // const deleteAllLike = await Like.deleteMany();
    // const deleteAllSave = await Save.deleteMany();
    // const deleteAllFollower = await Follower.deleteMany();

    // console.log("deleteAllPost", deleteAllPost);
    // console.log("deleteAllLike", deleteAllLike);
    // console.log("deleteAllSave", deleteAllSave);
    // console.log("deleteAllFollower", deleteAllFollower);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error processing image:", error);
    mongoose.connection.close();
  }
});
