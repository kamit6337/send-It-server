import Chat from "../../models/ChatModel.js";

const getUnseenChatsCountDB = async (userId, roomId) => {
  if (!userId || !roomId) throw new Error("UserId or RoomId is not provided");

  const counts = await Chat.countDocuments({
    room: roomId,
    sender: { $ne: userId },
    isSeen: false,
  });

  return counts;
};

export default getUnseenChatsCountDB;
