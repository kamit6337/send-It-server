import Room from "../../models/RoomModel.js";

const getRoomByIdDB = async (roomId) => {
  if (!roomId) {
    throw new Error("RoomId is not provided");
  }

  const result = await Room.findOne({
    _id: roomId,
  });

  return result;
};

export default getRoomByIdDB;
