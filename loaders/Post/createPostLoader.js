import DataLoader from "dataloader";
import mapLoaderResult from "../../utils/javaScript/mapLoaderResult.js";
import getPostByIdDB from "../../database/Post/getPostByIdDB.js";

const createPostLoader = () =>
  new DataLoader(async (ids) => {
    const postIds = [...ids];

    const posts = await getPostByIdDB(postIds);

    return mapLoaderResult(postIds, posts);
  });

export default createPostLoader;
