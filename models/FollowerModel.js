import { Schema, model } from "mongoose";

const followerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

followerSchema.index({ user: 1, follower: 1 }, { unique: true });
followerSchema.index({ user: 1 });
followerSchema.index({ follower: 1 });

const Follower = model("Follower", followerSchema);

export default Follower;
