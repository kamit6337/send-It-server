import Save from "../../models/SaveModel.js";

const userSavePostCount = async (userId) => {
  const count = await Save.countDocuments({
    user: userId,
  });

  return count;
};

export default userSavePostCount;
