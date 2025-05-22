import Room from "../../models/RoomModel.js";

const getUserRoomsDB = async (userId) => {
  if (!userId) {
    throw new Error("UserId is not provided");
  }

  const rooms = await Room.find({
    users: userId,
  })
    .sort("-updatedAt")
    .lean();

  return rooms;
};

export default getUserRoomsDB;
