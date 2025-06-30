import Chat from "../../models/ChatModel.js";

const isSeenChatsDB = async (chatIds) => {
  if (!Array.isArray(chatIds) || chatIds.length === 0)
    throw new Error("Chat Ids is not provided");

  const updateIsSeen = await Chat.updateMany(
    {
      _id: { $in: chatIds },
      isSeen: false,
    },
    {
      isSeen: true,
    }
  );

  console.log("updateIsSeen", updateIsSeen);

  return updateIsSeen;
};

export default isSeenChatsDB;
