import getUnseenChatsCountDB from "../../database/Chat/getUnseenChatsCountDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import { getChatsFromRedis } from "../../redis/Chat/chat.js";

const getUnseenChatsCount = catchGraphQLError(
  async (parent, args, { req, loaders }) => {
    const findUser = await Req(req);

    const { roomId } = args;

    const allChatsFromRedis = await getChatsFromRedis(roomId, 0, 0);

    // MARK: GET UNSEEN CHATS COUNT FROM REDIS
    const redisCounts =
      allChatsFromRedis.length > 0
        ? allChatsFromRedis
            .filter((chat) => {
              return (
                chat.sender.toString() !== findUser._id.toString() &&
                !chat.isSeen
              );
            })
            .length()
        : 0;

    // MARK: GET UNSEEN CHATS COUNT FROM MONGODB
    const mongoDbCounts = await getUnseenChatsCountDB(findUser._id, roomId);

    return redisCounts + mongoDbCounts;
  }
);

export default getUnseenChatsCount;
