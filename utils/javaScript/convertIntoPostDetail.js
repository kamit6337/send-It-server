const convertIntoPostDetail = (post, user) => {
  if (!post || !user) return null;

  return {
    _id: post._id,
    replyCount: post.replyCount,
    likeCount: post.likeCount,
    viewCount: post.viewCount,
    saveCount: post.saveCount,
    retweetCount: post.retweetCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    },
  };
};

export default convertIntoPostDetail;
