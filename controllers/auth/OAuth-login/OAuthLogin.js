import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import cookieOptions from "../../../utils/cookieOptions.js";
import createUserName from "../../../utils/javaScript/createUserName.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import uploadProfileImageToS3 from "../../../lib/uploadProfileImageToS3.js";

// NOTE: LOGIN SUCCESS
const OAuthLogin = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(
      new HandleGlobalError("Error in login. Please try again!", 403)
    );

  const {
    id,
    provider,
    _json: { name, email, picture },
  } = req.user;

  let findUser = await getUserByEmail(email);

  if (!findUser) {
    // MARK: IF NOT FIND USER

    const userName = createUserName(name);
    const photo = await uploadProfileImageToS3(picture);

    const obj = {
      name,
      username: userName,
      email,
      photo,
      OAuthId: id,
      OAuthProvider: provider,
    };

    const createUser = await postCreateUser(obj);

    if (!createUser) {
      return next(new HandleGlobalError("Issue in Signup", 404));
    }

    const token = encrypt({
      id: createUser._id.toString(),
      role: createUser.role,
    });

    res.cookie("_use", token, cookieOptions);

    res.redirect(`${environment.CLIENT_URL}/flow?username=${userName}`);
    return;
  }

  // MARK: IF FIND USER IS PRESENT
  const token = encrypt({
    id: findUser._id,
    role: findUser.role,
  });

  res.cookie("_use", token, cookieOptions);

  res.redirect(environment.CLIENT_URL);
});

export default OAuthLogin;
