import catchGraphQLError from "../../lib/catchGraphQLError.js";
import uploadVideoByFormData from "../../lib/cloudinary/uploadVideoByFormData.js";
import Req from "../../lib/Req.js";

const getMediaUrlForVideo = catchGraphQLError(
  async (parent, args, contextValue) => {
    await Req(contextValue.req);

    const { folder } = args;

    if (folder === "POST") {
      const folderExtension = "Posts";
      const result = uploadVideoByFormData(folderExtension);
      return result;
    }

    if (folder === "CHAT") {
      const folderExtension = "Chats";
      const result = uploadVideoByFormData(folderExtension);
      return result;
    }

    throw new Error("Folder is wrong");
  }
);

export default getMediaUrlForVideo;
