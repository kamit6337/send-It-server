import catchGraphQLError from "../../lib/catchGraphQLError.js";
import uploadImageByFormData from "../../lib/cloudinary/uploadImageByFormData.js";
import Req from "../../lib/Req.js";

const getMediaUrlForImage = catchGraphQLError(
  async (parent, args, contextValue) => {
    await Req(contextValue.req);

    const { folder } = args;

    if (folder === "POST") {
      const folderExtension = "Posts";
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    if (folder === "CHAT") {
      const folderExtension = "Chats";
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    if (folder === "THUMBNAIL") {
      const folderExtension = "Thumbnails";
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    if (folder === "PROFILE") {
      const folderExtension = "Profile";
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    if (folder === "PROFILE_BG") {
      const folderExtension = "Profile_Bg";
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    throw new Error("Folder is wrong");
  }
);

export default getMediaUrlForImage;
