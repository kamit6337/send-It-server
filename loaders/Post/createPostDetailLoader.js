import PostDetail from "../../models/PostDetailModel.js";
import mapLoaderResult from "../../utils/javaScript/mapLoaderResult.js";
import DataLoader from "dataloader";

const createPostDetailLoader = () =>
  new DataLoader(async (ids) => {
    const postIds = [...ids];

    const results = await PostDetail.find({
      post: { $in: postIds },
    }).lean();

    const map = new Map(results.map((u) => [u.post.toString(), u]));
    return postIds.map((postId) => map.get(postId.toString()));
  });

export default createPostDetailLoader;
