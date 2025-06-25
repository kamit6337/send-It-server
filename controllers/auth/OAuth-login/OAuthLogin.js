import { environment } from "../../../utils/environment.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import uploadImageByURL from "../../../lib/cloudinary/uploadImageByURL.js";
import isLocalhostOrigin from "../../../utils/isLocalhostOrigin.js";

// NOTE: LOGIN SUCCESS
const OAuthLogin = catchAsyncError(async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect(`${isLocalhostOrigin(req) || environment.CLIENT_URL}/oauth`);
      return;
    }

    let {
      id,
      provider,
      _json: { name, email, picture },
    } = req.user;

    let findUser = await getUserByEmail(email);

    if (!findUser) {
      // MARK: IF NOT FIND USER

      let uploadedPicture = picture;

      uploadedPicture = await uploadImageByURL(picture);

      const obj = {
        name,
        email,
        photo: uploadedPicture,
        OAuthId: id,
        OAuthProvider: provider,
        passwordLastUpdated: new Date(),
      };

      const createUser = await postCreateUser(obj);

      if (!createUser) {
        res.redirect(
          `${isLocalhostOrigin(req) || environment.CLIENT_URL}/oauth`
        );
        return;
      }

      const token = encrypt({
        id: createUser._id.toString(),
        role: createUser.role,
      });

      res.redirect(
        `${
          isLocalhostOrigin(req) || environment.CLIENT_URL
        }/oauth?token=${token}`
      );
      return;
    }

    // MARK: IF FIND USER IS PRESENT
    const token = encrypt({
      id: findUser._id,
      role: findUser.role,
    });

    res.redirect(
      `${isLocalhostOrigin(req) || environment.CLIENT_URL}/oauth?token=${token}`
    );
  } catch (error) {
    console.log("Error in OAuth Login", error);
    res.redirect(`${isLocalhostOrigin(req) || environment.CLIENT_URL}/oauth`);
  }
});

export default OAuthLogin;
