import Chat from "../../models/ChatModel.js";

const deleteChatByIdDB = async (chatId) => {
  if (!chatId) throw new Error("ChatId is not provided");

  const result = await Chat.deleteOne({
    _id: chatId,
  });

  return result;
};

export default deleteChatByIdDB;
