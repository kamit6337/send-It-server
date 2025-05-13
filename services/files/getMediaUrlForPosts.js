import catchGraphQLError from "../../lib/catchGraphQLError.js";
import uploadImageByFormData from "../../lib/cloudinary/uploadImageByFormData.js";
import uploadVideoByFormData from "../../lib/cloudinary/uploadVideoByFormData.js";
import Req from "../../lib/Req.js";

const getMediaUrlForPosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    await Req(contextValue.req);

    const { type } = args;

    const folderExtension = "Posts";

    if (type === "IMAGE") {
      const result = uploadImageByFormData(folderExtension);
      return result;
    }

    if (type === "VIDEO") {
      const result = uploadVideoByFormData(folderExtension);
      return result;
    }

    throw new Error("Type is incorrect");
  }
);

export default getMediaUrlForPosts;
