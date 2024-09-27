import Chat from "../../models/ChatModel.js";

const chatsByRoomId = async (roomId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const findChats = await Chat.find({
    room: roomId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return findChats;
};

export default chatsByRoomId;
