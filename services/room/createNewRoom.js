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

  console.log("user", user);

  if (user.messageBy === NO_ONE) {
    throw new Error(
      `Sorry, Message cannot be created. ${user.name} disable Message to anyone.`
    );
  }

  if (user.messageBy === FOLLOWERS) {
    const isIFollowHim = await amIFollowThisUser(userId, findUser._id);

    console.log("isIFollowHim", isIFollowHim);

    if (!isIFollowHim) {
      throw new Error(
        `Sorry, Message cannot be created. ${user.name} allow only his Followers to message.`
      );
    }
  }

  if (user.messageBy === FOLLOWINGS) {
    const isHeFollowMe = await amIFollowThisUser(findUser._id, userId);

    console.log("isHeFollowMe", isHeFollowMe);

    if (!isHeFollowMe) {
      throw new Error(
        `Sorry, Message cannot be created. ${user.name} allow only his Following to message.`
      );
    }
  }

  const userIds = [userId, findUser._id?.toString()];

  const result = await createNewRoomDB(userIds);

  console.log("result", result);

  for (const userId of userIds) {
    const sockets = await io.in(userId).fetchSockets(); // all sockets for that user

    sockets.forEach((sock) => {
      sock.join(result._id.toString()); // join chat room
    });

    io.to(userId).emit("new-room", { ...result, unSeenChatsCount: 0 });
  }

  const newNotificationObj = {
    user: userId,
    type: "message",
    sender: [findUser._id],
    senderIds: [findUser._id],
    totalSenders: 1,
    room: result._id,
  };

  const newNotification = await createNewNotificationDB(newNotificationObj);

  console.log("newNotification", newNotification);

  io.to(userId).emit("notification", {
    ...newNotification,
    message: notificationMsg(newNotification),
    sender: [findUser],
    room: result,
  });

  io.to(userId).emit("notification-count", 1);

  return result._id;
});

export default createNewRoom;
