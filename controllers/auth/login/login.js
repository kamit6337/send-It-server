import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import User from "../../../models/UserModel.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //   MARK: IF USER DOES NOT PROVIDE EITHER EMAIL OR PASSWORD
  if (!email || !password) {
    return next(
      new HandleGlobalError("Email or Password is not provided", 404)
    );
  }

  const findUser = await User.findOne({ email }).select("+password");

  if (!findUser) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  if (!findUser.password) {
    return next(
      new HandleGlobalError("Please reset your password to login", 404)
    );
  }

  //   MARK: IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD, THROW ERROR
  const isPasswordValid = findUser.checkPassword(password); // Boolean

  if (!isPasswordValid) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   MARK: USER EMAIL AND PASSWORD IS CONFIRMED, SEND TOKEN AND MAKE LOGIN
  const token = encrypt({
    id: findUser._id,
    role: findUser.role,
  });

  res.cookie("_use", token, cookieOptions);

  res.status(200).json({
    message: "Login Successfully",
  });
});

export default login;
