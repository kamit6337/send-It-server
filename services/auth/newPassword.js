import patchUserProfile from "../../database/User/patchUserProfile.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import {
  deleteKeyFromRedis,
  getUserIdFromRedis,
} from "../../redis/Auth/forgotPassword.js";

const newPassword = catchGraphQLError(async (parent, args, contextValue) => {
  const { resetToken, password } = args;

  if (!resetToken || !password) {
    throw new Error("ResetToken and Password is required");
  }

  const userId = await getUserIdFromRedis(resetToken);

  if (!userId) {
    throw new Error("Issue in Resetting Password. Try again later");
  }

  const obj = {
    password,
    updatedAt: Date.now(),
  };

  await patchUserProfile(userId, obj);

  await deleteKeyFromRedis(resetToken);

  return "Password has been updated";
});

export default newPassword;
