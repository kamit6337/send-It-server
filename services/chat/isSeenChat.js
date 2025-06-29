import isSeenChatsDB from "../../database/Chat/isSeenChatsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import { isSeenChatMsgIntoRedis } from "../../redis/Chat/chat.js";

const isSeenChat = catchGraphQLError(async (parent, args, { req, loaders }) => {
  const findUser = await Req(req);

  const { chatIds } = args;

  const chatIdsUpdatedFromDB = [];

  for (const chatId of chatIds) {
    const isSeenUpdatedInRedis = await isSeenChatMsgIntoRedis(chatId);
    if (!isSeenUpdatedInRedis) chatIdsUpdatedFromDB.push(chatId);
  }

  // MARK: UPDATE IS SEEN IN MONGODB
  if (chatIdsUpdatedFromDB.length > 0) {
    await isSeenChatsDB(chatIdsUpdatedFromDB);
  }

  return "Chat Ids has been seen";
});

export default isSeenChat;
