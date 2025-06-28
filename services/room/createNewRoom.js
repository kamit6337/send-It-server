import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import createNewNotificationDB from "../../database/Notification/createNewNotificationDB.js";
import createNewRoomDB from "../../database/Room/createNewRoomDB.js";
import getUserById from "../../database/User/getUserById.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";

const ANYONE = "anyone";
const FOLLOWERS = "followers";
const FOLLOWINGS = "followings";
const NO_ONE = "no_one";

const createNewRoom = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { userId } = args;

  const user = await getUserById(userId);

  if (user.messageBy === NO_ONE) {
    throw new Error("Sorry, Chat cannot be created");
  }

  if (
    user.messageBy === FOLLOWERS &&
    !(await amIFollowThisUser(findUser._id, userId))
  ) {
    throw new Error("Sorry, Chat cannot be created");
  }

  if (
    user.messageBy === FOLLOWINGS &&
    !(await amIFollowThisUser(userId, findUser._id))
  ) {
    throw new Error("Sorry, Chat cannot be created");
  }

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

  return result;
});

export default createNewRoom;
