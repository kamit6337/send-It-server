import catchAsyncError from "../../../utils/catchAsyncError.js";
import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import resetPasswordLinkTemplate from "../../../utils/email/resetPasswordLinkTemplate.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import sendingEmail from "../../../utils/email/email.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HandleGlobalError("Email is not provided", 404));
  }

  const findUser = await getUserByEmail(email);

  if (!findUser) {
    return next(
      new HandleGlobalError(
        "You are not our customer. Please signup first",
        403
      )
    );
  }

  // MARK: GENERATE TOKEN BASED ON USER ID AND ITS EMAIL
  const token = encrypt(
    {
      id: findUser._id,
      email: findUser.email,
    },
    15 * 60 * 1000 //15 minutes
  );

  const url = `${environment.CLIENT_URL}/newPassword?token=${token}&email=${email}`;

  const html = resetPasswordLinkTemplate(url);

  await sendingEmail(email, "Reset Password Link", html);

  res.json({
    message: "Send reset password link to user",
  });
});

export default forgotPassword;
