import getUnseenChatsCountDB from "../../database/Chat/getUnseenChatsCountDB.js";
import { getChatsFromRedis } from "../../redis/Chat/chat.js";

const unSeenChatsCountFn = async (roomId, userId) => {
  if (!roomId || !userId) throw new Error("RoomId or userId is not provided");

  const allChatsFromRedis = await getChatsFromRedis(roomId, 0, 0);

  // MARK: GET UNSEEN CHATS COUNT FROM REDIS
  const redisCounts =
    allChatsFromRedis.length > 0
      ? allChatsFromRedis.filter((chat) => {
          return (
            chat.sender.toString() !== userId.toString() &&
            chat.isSeen === "false"
          );
        }).length
      : 0;

  // MARK: GET UNSEEN CHATS COUNT FROM MONGODB
  const mongoDbCounts = await getUnseenChatsCountDB(userId, roomId);

  return {
    roomId,
    userId,
    count: redisCounts + mongoDbCounts,
  };
};

export default unSeenChatsCountFn;
