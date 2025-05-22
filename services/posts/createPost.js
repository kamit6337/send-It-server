import createPostDB from "../../database/Post/createPostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const createPost = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { message = "", media = "", duration = 0, thumbnail = "" } = args;

  if (!message && !media) {
    throw new Error("Message or Media is not provided");
  }

  const obj = {
    user: findUser._id,
    message,
    media,
    duration,
    thumbnail,
  };

  const createPostResult = await createPostDB(obj);

  const response = {
    ...createPostResult,
    user: {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    },
    isFollow: false, // this must be modified at the frontend on recieve by socket
  };

  io.emit("new-post", response);

  return "New Post has been created";
});

export default createPost;
