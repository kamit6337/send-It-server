import DataLoader from "dataloader";
import User from "../../models/UserModel.js";

const createUserLoader = () =>
  new DataLoader(async (ids) => {
    const userIds = [...ids];

    const users = await User.find({
      _id: { $in: userIds },
    }).lean();

    const map = new Map(users.map((u) => [u._id.toString(), u]));

    return ids.map((id) => map.get(id.toString()));
  });

export default createUserLoader;
