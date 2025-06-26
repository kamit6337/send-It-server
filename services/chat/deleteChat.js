import deleteChatByIdDB from "../../database/Chat/deleteChatByIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { deleteChatMsgIntoRedis } from "../../redis/Chat/chat.js";

const deleteChat = catchGraphQLError(async (parent, args, { req, loaders }) => {
  const findUser = await Req(req);

  const { io } = socketConnect();

  const { chatId, roomId } = args;

  const isDeletedFromRedis = await deleteChatMsgIntoRedis(chatId);

  if (!isDeletedFromRedis) {
    await deleteChatByIdDB(chatId);
  }

  io.to(roomId).emit("delete-chat", { roomId, chatId });

  return "Chat has been deleted";
});

export default deleteChat;
