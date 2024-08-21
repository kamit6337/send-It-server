import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import s3Client from "../../utils/aws/awsS3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { environment } from "../../utils/environment.js";

const preSignedAWS = async (req, res, next, { keyFolder }) => {
  let { fileType } = req.body;

  if (!fileType) {
    return next(new HandleGlobalError("FileType must be provided", 404));
  }

  const file = fileType.split("/");

  const fileKey = `${keyFolder}/${file[0]}-${Date.now()}.${file[1]}`;

  const command = new PutObjectCommand({
    Bucket: environment.AWS_S3_BUCKET,
    Key: fileKey,
    ContentType: fileType,
    ACL: "public-read",
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  return { url, fileKey, fileType };
};

export default preSignedAWS;
