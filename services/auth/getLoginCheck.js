import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getLoginCheck = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  return {
    _id: findUser._id,
    name: findUser.name,
    photo: findUser.photo,
    email: findUser.email,
    role: findUser.role,
  };
});

export default getLoginCheck;
