import createNewRoomDB from "../../database/Room/createNewRoomDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const createNewRoom = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { userId } = args;

  const userIds = [userId, findUser._id?.toString()];

  console.log("userIds", userIds);

  const result = await createNewRoomDB(userIds);

  console.log("result", result);

  for (const userId of userIds) {
    const sockets = await io.in(userId).fetchSockets(); // all sockets for that user

    sockets.forEach((sock) => {
      sock.join(result._id.toString()); // join chat room
    });

    io.to(userId).emit("new-room", result);
  }

  return result;
});

export default createNewRoom;
