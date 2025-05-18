import Chat from "../../models/ChatModel.js";

const deleteChatsByRoomIdDB = async (roomId) => {
  if (!roomId) {
    throw new Error("RoomId is not provided");
  }

  const result = await Chat.deleteMany({
    room: roomId,
  });

  return result;
};

export default deleteChatsByRoomIdDB;
