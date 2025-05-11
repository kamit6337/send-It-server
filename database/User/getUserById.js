import User from "../../models/UserModel.js";
import { getUserByIdRedis, setUserIntoRedis } from "../../redis/User/user.js";

const getUserById = async (userId) => {
  const get = await getUserByIdRedis(userId);
  if (get) {
    return get;
  }

  const findUser = await User.findOne({
    _id: userId,
  });

  await setUserIntoRedis(findUser);

  return findUser;
};

export default getUserById;
