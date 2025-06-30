import getPostDetailByIdDB from "../../database/Post_Details/getPostDetailByIdDB.js";
import DataLoader from "dataloader";

const createPostDetailLoader = () =>
  new DataLoader(async (ids) => {
    const postIds = [...ids];

    const results = await getPostDetailByIdDB(postIds);

    const map = new Map(results.map((u) => [u.post.toString(), u]));
    return postIds.map((postId) => map.get(postId.toString()));
  });

export default createPostDetailLoader;
