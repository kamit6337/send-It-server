import DataLoader from "dataloader";
import User from "../../models/UserModel.js";
import mapLoaderResult from "../../utils/javaScript/mapLoaderResult.js";

const createUserLoader = () =>
  new DataLoader(async (ids) => {
    const userIds = [...ids];

    const users = await User.find({
      _id: { $in: userIds },
    }).lean();

    return mapLoaderResult(userIds, users);
  });

export default createUserLoader;
