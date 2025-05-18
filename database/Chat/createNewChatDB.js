import Chat from "../../models/ChatModel.js";

const createNewChatDB = async (obj) => {
  if (!obj) {
    throw new Error("Obj is not provided");
  }

  const newChat = await Chat.create({
    ...obj,
  });

  return JSON.parse(JSON.stringify(newChat));
};

export default createNewChatDB;
