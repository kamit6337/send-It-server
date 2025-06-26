import Chat from "../../models/ChatModel.js";

const deleteChatByIdDB = async (chatId) => {
  if (!chatId) throw new Error("ChatId is not provided");

  const result = await Chat.findOneAndUpdate(
    {
      _id: chatId,
    },
    {
      deleted: true,
      updatedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  return result;
};

export default deleteChatByIdDB;
