const LIKE = "like";
const REPLY = "reply";
const FOLLOWER = "follower";
const UNFOLLOW = "unfollow";
const MESSAGE = "message";

const notificationMsg = (notification) => {
  if (!notification) return "Something went wrong with notification";

  const clone = JSON.parse(JSON.stringify(notification));

  if (clone.type === LIKE) {
    return `${clone.totalSenders} new user(s) like your post.`;
  }

  if (clone.type === REPLY) {
    return `${clone.totalSenders} new user(s) reply to your post.`;
  }

  if (clone.type === FOLLOWER) {
    return `${clone.totalSenders} new user(s) followed you.`;
  }

  if (clone.type === UNFOLLOW) {
    return `${clone.totalSenders} new user(s) unfollow you.`;
  }

  if (clone.type === MESSAGE) {
    return `User created a new Chat with you.`;
  }

  return "Something went wrong with type or notification";
};

export default notificationMsg;
