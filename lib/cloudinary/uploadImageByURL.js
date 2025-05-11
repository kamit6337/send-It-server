import { v2 as cloudinary } from "cloudinary";
import { environment } from "../../utils/environment.js";

const uploadImageByURL = async (url) => {
  try {
    cloudinary.config({
      cloud_name: environment.CLOUDINARY_CLOUD_NAME,
      api_key: environment.CLOUDINARY_API_KEY,
      api_secret: environment.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(url, {
      folder: environment.PROJECT_NAME,
      eager: ["c_pad,h_300,w_400,q_auto"],
    });

    return result?.secure_url;
  } catch (error) {
    throw new Error(error?.message);
  }
};

export default uploadImageByURL;
