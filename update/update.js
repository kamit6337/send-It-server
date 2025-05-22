import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import Like from "../models/LikeModel.js";
import Save from "../models/SaveModel.js";
import Follower from "../models/FollowerModel.js";
import Notification from "../models/NotificationModel.js";
import PostDetail from "../models/PostDetailModel.js";

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
    const posts = await Post.updateMany(
      {
        replyPostId: { $exists: true },
      },
      {
        $rename: { replyPostId: "replyPost" },
      }
    );

    console.log("posts", posts);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error processing image:", error);
    mongoose.connection.close();
  }
});
