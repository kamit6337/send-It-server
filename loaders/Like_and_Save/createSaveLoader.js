import Save from "../../models/SaveModel.js";
import DataLoader from "dataloader";

const createSaveLoader = () =>
  new DataLoader(async (ids) => {
    const saveIds = [...ids];

    const saves = await Save.find({
      $or: saveIds,
    }).lean();

    const saveSet = new Set(
      saves.map((save) => `${save.user.toString()}_${save.post.toString()}`)
    );

    return saveIds.map(({ user, post }) =>
      saveSet.has(`${user.toString()}_${post.toString()}`)
    );
  });

export default createSaveLoader;
