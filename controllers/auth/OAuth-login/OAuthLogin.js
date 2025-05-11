import { environment } from "../../../utils/environment.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import uploadImageByURL from "../../../lib/cloudinary/uploadImageByURL.js";

// NOTE: LOGIN SUCCESS
const OAuthLogin = catchAsyncError(async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect(`${environment.CLIENT_URL}/oauth`);
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

      uploadedPicture = await uploadImageByURL();

      const obj = {
        name,
        email,
        photo: uploadedPicture,
        OAuthId: id,
        OAuthProvider: provider,
      };

      const createUser = await postCreateUser(obj);

      if (!createUser) {
        res.redirect(`${environment.CLIENT_URL}/oauth`);
        return;
      }

      const token = encrypt({
        id: createUser._id.toString(),
        role: createUser.role,
      });

      res.redirect(`${environment.CLIENT_URL}/oauth?use=${token}`);
      return;
    }

    // MARK: IF FIND USER IS PRESENT
    const token = encrypt({
      id: findUser._id,
      role: findUser.role,
    });

    res.redirect(`${environment.CLIENT_URL}/oauth?use=${token}`);
  } catch (error) {
    console.log("Error in OAuth Login", error);
    res.redirect(`${environment.CLIENT_URL}/oauth`);
  }
});

export default OAuthLogin;
