import Like from "../../models/LikeModel.js";
import DataLoader from "dataloader";

const createLikeLoader = () =>
  new DataLoader(async (ids) => {
    const likeIds = [...ids];

    // [{user, post}]

    const likes = await Like.find({
      $or: likeIds,
    }).lean();

    const likeSet = new Set(
      likes.map((like) => `${like.user.toString()}_${like.post.toString()}`)
    );

    return likeIds.map(({ user, post }) =>
      likeSet.has(`${user.toString()}_${post.toString()}`)
    );
  });

export default createLikeLoader;
