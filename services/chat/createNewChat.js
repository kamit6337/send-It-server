import createNewChatDB from "../../database/chat/createNewChatDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const createNewChat = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { roomId, message, media } = args;

  if (!message && !media) {
    throw new Error("Either Message or Media post to create chat");
  }

  const obj = {
    room: roomId,
    sender: findUser._id,
    message,
    media,
  };

  const result = await createNewChatDB(obj);

  io.to(roomId).emit("new-chat", result);

  return result;
});

export default createNewChat;
