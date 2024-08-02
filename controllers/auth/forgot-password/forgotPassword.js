import catchAsyncError from "../../../utils/catchAsyncError.js";
import nodemailer from "nodemailer";
import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import User from "../../../models/UserModel.js";
import resetPasswordLinkTemplate from "../../../utils/email/resetPasswordLinkTemplate.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import sendingEmail from "../../../utils/email/email.js";

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.MY_GMAIL_ID,
    pass: environment.MY_GMAIL_PASSWORD,
  },
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HandleGlobalError("Email is not provided", 404));
  }

  const findUser = await User.findOne({ email });

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

  const otpUrl = `${environment.CLIENT_URL}/newPassword?token=${token}&email=${email}`;

  const html = resetPasswordLinkTemplate(otpUrl);

  await sendingEmail(email, "Reset Password Link", html);

  res.json({
    message: "Send reset password link to user",
  });
});

export default forgotPassword;
