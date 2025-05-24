import getChatsByRoomIdDB from "../../database/Chat/getChatsByRoomIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getRoomChats = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { roomId, page } = args;

  const result = await getChatsByRoomIdDB(roomId, page);

  return result;
});

export default getRoomChats;
