import getChatsByRoomIdDB from "../../database/Chat/getChatsByRoomIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import {
  getChatsFromRedis,
  getRoomChatsOfRedisLength,
} from "../../redis/Chat/chat.js";

const getRoomChats = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { roomId, page } = args;

  const limit = 20;
  const skip = (page - 1) * limit;

  const lengthOfMsgInRedis = await getRoomChatsOfRedisLength(roomId);

  let results = [];

  if (lengthOfMsgInRedis >= skip + limit) {
    // lengthOfMsgInRedis = 22, skip = 0, limit = 20
    // lengthOfMsgInRedis = 42, skip = 20, limit = 20

    results = await getChatsFromRedis(roomId, skip, limit);
  } else if (lengthOfMsgInRedis > skip) {
    // lengthOfMsgInRedis = 1, skip = 0, limit = 20
    // lengthOfMsgInRedis = 21, skip = 20, limit = 20

    const msgsFromRedis = await getChatsFromRedis(roomId, skip, limit);

    const remaining = skip + limit - lengthOfMsgInRedis;

    const msgsFromDB = await getChatsByRoomIdDB(
      roomId,
      0,
      remaining // 19
    );

    results = [...msgsFromRedis, ...msgsFromDB];
  } else {
    // lengthOfMsgInRedis = 0, skip = 0, limit = 20
    // lengthOfMsgInRedis = 0 or 15, skip = 20, limit = 20

    const adjustedSkip = skip - lengthOfMsgInRedis;

    results = await getChatsByRoomIdDB(roomId, adjustedSkip, limit);
  }

  return results;
});

export default getRoomChats;
