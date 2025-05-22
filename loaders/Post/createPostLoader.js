import DataLoader from "dataloader";
import Post from "../../models/PostModel.js";
import mapLoaderResult from "../../utils/javaScript/mapLoaderResult.js";

const createPostLoader = () =>
  new DataLoader(async (ids) => {
    const postIds = [...ids];

    const posts = await Post.find({
      _id: { $in: postIds },
    }).lean();

    return mapLoaderResult(postIds, posts);
  });

export default createPostLoader;
