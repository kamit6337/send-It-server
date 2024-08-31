import User from "../../models/UserModel.js";

const getUserBySearch = async (userId, search) => {
  const users = await User.find({
    $or: [
      { name: { $regex: new RegExp(search, "i") } },
      { username: { $regex: new RegExp(search, "i") } },
    ],
    _id: { $ne: userId },
  });

  return users;
};

export default getUserBySearch;
