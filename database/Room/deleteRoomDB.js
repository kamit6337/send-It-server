import Room from "../../models/RoomModel.js";

const deleteRoomDB = async (roomId) => {
  if (!roomId) {
    throw new Error("RoomId is not provided");
  }

  const result = await Room.deleteOne({
    _id: roomId,
  });

  return result;
};

export default deleteRoomDB;
