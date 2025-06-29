import redisClient from "../redisClient.js";

export const getRoomChatsOfRedisLength = async (roomId) => {
  if (!roomId) {
    throw new Error("RoomId is not provided");
  }

  const length = await redisClient.zcard(`Chat_Room:${roomId}`);
  return length || 0;
};

export const getChatsFromRedis = async (roomId, skip, limit) => {
  if (!roomId) {
    throw new Error("RoomId is not provided");
  }

  const chatIds = await redisClient.zrevrange(
    `Chat_Room:${roomId}`,
    skip,
    skip + limit - 1
  );

  if (!chatIds || chatIds.length === 0) return [];

  const chatMsgs = await Promise.all(
    chatIds.map((chatId) => redisClient.hgetall(`Chat_Msg:${chatId}`))
  );

  return chatMsgs;
};

export const setNewChatIntoRedis = async (chatObj) => {
  if (!chatObj || !chatObj.room) return;

  await redisClient.zadd(
    `Chat_Room:${chatObj.room}`,
    chatObj.createdAt,
    chatObj._id.toString()
  );

  await redisClient.hset(`Chat_Msg:${chatObj._id.toString()}`, chatObj);
};

export const deleteChatMsgIntoRedis = async (chatId) => {
  if (!chatId) return false;

  const isExist = await redisClient.exists(`Chat_Msg:${chatId}`);

  if (!isExist) return false;

  await redisClient.hset(`Chat_Msg:${chatId}`, "deleted", true);
  return true;
};

export const isSeenChatMsgIntoRedis = async (chatId) => {
  if (!chatId) return false;

  const isExist = await redisClient.exists(`Chat_Msg:${chatId}`);

  if (!isExist) return false;

  const msg = await redisClient.hget(`Chat_Msg:${chatId}`, "isSeen");

  if (msg === "true") return true; // already seen

  await redisClient.hset(`Chat_Msg:${chatId}`, "isSeen", true);
  return true;
};
