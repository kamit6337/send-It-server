import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { setNewChatIntoRedis } from "../../redis/Chat/chat.js";
import ObjectID from "../../lib/ObjectID.js";
import { addChatJob } from "../../queues/chatQueues/chatQueue.js";

const createNewChat = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { roomId, message, media } = args;

  if (!message && !media) {
    throw new Error("Either Message or Media post to create chat");
  }

  const obj = {
    _id: ObjectID().toString(),
    room: roomId,
    sender: findUser._id.toString(),
    isSeen: [findUser._id.toString()],
    message,
    media,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setNewChatIntoRedis(obj);

  io.to(roomId).emit("new-chat", obj);

  await addChatJob(roomId);

  return obj;
});

export default createNewChat;
