import Chat from "../../models/ChatModel.js";

const getChatsByRoomIdDB = async (roomId, skip, limit) => {
  if (!roomId || skip === undefined || limit === undefined) {
    throw new Error("RoomId or skip or limit is not provided");
  }

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
