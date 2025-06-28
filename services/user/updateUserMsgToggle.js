import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const messageByType = ["anyone", "followers", "followings", "no_one"];

const updateUserMsgToggle = catchGraphQLError(
  async (parent, args, { req, loaders }) => {
    const findUser = await Req(req);

    const { messageBy } = args;

    if (!messageByType.includes(messageBy?.toLowerCase())) {
      throw new Error("Message By type is not provided");
    }

    const obj = {
      messageBy: messageBy.toLowerCase(),
    };

    const result = await patchUserProfile(findUser._id, obj);

    return messageBy.toLowerCase();
  }
);

export default updateUserMsgToggle;
