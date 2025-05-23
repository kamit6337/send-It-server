import createNewNotificationDB from "../../database/Notification/createNewNotificationDB.js";
import createNewRoomDB from "../../database/Room/createNewRoomDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";

const createNewRoom = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { userId } = args;

  const userIds = [userId, findUser._id?.toString()];

  const result = await createNewRoomDB(userIds);

  for (const userId of userIds) {
    const sockets = await io.in(userId).fetchSockets(); // all sockets for that user

    sockets.forEach((sock) => {
      sock.join(result._id.toString()); // join chat room
    });

    io.to(userId).emit("new-room", result);
  }

  const newNotificationObj = {
    user: userId,
    type: "message",
    sender: [findUser._id],
    totalSenders: 1,
    room: result._id,
  };

  const newNotification = await createNewNotificationDB(newNotificationObj);

  io.to(userId).emit("notification", {
    message: notificationMsg(newNotification),
    ...newNotification,
  });

  return "New Chat Room created";
});

export default createNewRoom;
