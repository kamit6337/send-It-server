import User from "../../../models/UserModel.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import bcrypt from "bcryptjs";

const newPassword = catchAsyncError(async (req, res, next) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const decoded = decrypt(token);

  const currentDate = Date.now();

  if (currentDate > decoded.exp) {
    return next(
      new HandleGlobalError(
        "It's time out. Click again on Forgot Password to send link",
        404
      )
    );
  }

  if (email !== decoded.email) {
    return next(new HandleGlobalError("Issue in create new Password"));
  }

  const hashPassword = bcrypt.hashSync(password, 12);

  await User.findOneAndUpdate(
    {
      _id: decoded.id,
    },
    {
      password: hashPassword,
      updatedAt: Date.now(),
    }
  );

  res.status(200).json({
    message: "Password has been updated",
  });
});

export default newPassword;
