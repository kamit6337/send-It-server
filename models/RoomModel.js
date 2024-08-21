import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);

export default Room;
