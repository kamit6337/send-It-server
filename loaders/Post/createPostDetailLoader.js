import PostDetail from "../../models/PostDetailModel.js";
import mapLoaderResult from "../../utils/javaScript/mapLoaderResult.js";
import DataLoader from "dataloader";

const createPostDetailLoader = () =>
  new DataLoader(async (ids) => {
    const postIds = [...ids];

    const results = await PostDetail.find({
      post: { $in: postIds },
    }).lean();

    return mapLoaderResult(postIds, results);
  });

export default createPostDetailLoader;
