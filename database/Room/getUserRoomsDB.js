import Room from "../../models/RoomModel.js";

const getUserRoomsDB = async (userId) => {
  if (!userId) {
    throw new Error("UserId is not provided");
  }

  const rooms = await Room.find({
    users: userId,
  })
    .populate({
      path: "users",
      select: "_id name email photo",
    })
    .sort("-updatedAt")
    .lean();

  return rooms;
};

export default getUserRoomsDB;
