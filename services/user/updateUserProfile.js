import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const updateUserProfile = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);
    const { io } = socketConnect();

    const { name, photo, bg_photo, bio, location, website } = args;

    const obj = {
      name,
      photo,
      bg_photo,
      bio,
      location,
      website,
    };

    const result = await patchUserProfile(findUser._id, obj);

    io.emit("update-user-bio", result);

    return result;
  }
);

export default updateUserProfile;
