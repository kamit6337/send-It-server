import Chat from "../../models/ChatModel.js";

const getChatsByRoomIdDB = async (roomId, page) => {
  if (!roomId || !page) {
    throw new Error("RoomId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const chats = await Chat.find({
    room: roomId,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean();

  return chats;
};

export default getChatsByRoomIdDB;
