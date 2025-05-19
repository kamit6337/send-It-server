import { Schema, model } from "mongoose";

/**
 * 1. when others follow me, send me notification of other users
 * 2. when other like my post, send me notification of others user
 * 3. when other reply to my post, send me other users and postId - postId of my post
 * 4. when someone, create Room and send me message, send me notification that new room created by other user
 */

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["like", "reply", "follower", "message"],
      required: [true, "Notification type is a must"],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1 });

const Notification = model("Notification", notificationSchema);

export default Notification;
