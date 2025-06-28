import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";
import Like from "../models/LikeModel.js";
import Save from "../models/SaveModel.js";
import Follower from "../models/FollowerModel.js";
import Notification from "../models/NotificationModel.js";
import PostDetail from "../models/PostDetailModel.js";
import Chat from "../models/ChatModel.js";

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
    const result = await User.updateMany(
      {},
      {
        $set: { messageBy: "anyone" },
      }
    );

    console.log("result", result);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error processing image:", error);
    mongoose.connection.close();
  }
});
