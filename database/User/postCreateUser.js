import User from "../../models/UserModel.js";
import { setUserIntoRedis } from "../../redis/User/user.js";

const postCreateUser = async (obj) => {
  if (!obj) {
    throw new Error("Obj is not provided");
  }

  const createUser = await User.create({
    ...obj,
  });

  await setUserIntoRedis(createUser);

  return createUser;
};

export default postCreateUser;
