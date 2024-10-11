import Chat from "../../models/ChatModel.js";

const newChatCreate = async (obj) => {
  const chat = await Chat.create({ ...obj });

  return chat;
};

export default newChatCreate;
