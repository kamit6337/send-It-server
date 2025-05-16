import User from "../../models/UserModel.js";
import sanitizedQuery from "../../utils/javaScript/sanitizedQuery.js";

const getUserBySearchDB = async (userId, search) => {
  if (!userId || !search) {
    throw new Error("UserId or Search string is not provided");
  }

  const query = sanitizedQuery(search);

  const users = await User.find({
    $or: [
      { name: { $regex: new RegExp(query, "i") } },
      { email: { $regex: new RegExp(query, "i") } },
    ],
    _id: { $ne: userId },
  }).lean();

  return users;
};

export default getUserBySearchDB;
