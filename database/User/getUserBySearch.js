import User from "../../models/UserModel.js";
import sanitizedQuery from "../../utils/javaScript/sanitizedQuery.js";

const getUserBySearch = async (userId, search) => {
  if (!userId || !search) {
    throw new Error("UserId or Search string is not provided");
  }

  const query = sanitizedQuery(search);

  const users = await User.find({
    $or: [
      { name: { $regex: new RegExp(query, "i") } },
      { username: { $regex: new RegExp(query, "i") } },
    ],
    _id: { $ne: userId },
  });

  return users;
};

export default getUserBySearch;
