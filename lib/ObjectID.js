import mongoose from "mongoose";

const ObjectID = (userId) => {
  if (!userId) {
    return new mongoose.Types.ObjectId();
  }

  const specificId = new mongoose.Types.ObjectId(`${userId}`);
  return specificId;
};

export default ObjectID;
