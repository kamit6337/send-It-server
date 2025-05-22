import updatePostDB from "../../database/Post/updatePostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const updatePost = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { id, message = "", media = "", duration = 0, thumbnail = "" } = args;

  if (!id) {
    throw new Error("Id is not provided");
  }

  if (!message && !media) {
    throw new Error("All fields is required");
  }

  const obj = {};

  if (message) obj.message = message;
  if (media) obj.media = media;
  if (duration) obj.duration = duration;
  if (thumbnail) obj.thumbnail = thumbnail;

  const post = await updatePostDB(id, obj);

  const response = {
    ...post,
    user: {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    },
    isFollow: false, // this must be modified at the frontend on recieve by socket
  };

  io.emit("update-post", response);

  return "Post has been updated";
});

export default updatePost;
