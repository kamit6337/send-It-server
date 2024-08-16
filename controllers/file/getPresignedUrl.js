import catchAsyncError from "../../utils/catchAsyncError.js";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../utils/aws/awsS3.js";

const getPresignedUrl = catchAsyncError(async (req, res, next) => {
  let { fileType } = req.body;

  if (!fileType) {
    return next(new HandleGlobalError("FileType must be provided", 404));
  }

  const file = fileType.split("/");

  const fileKey = `posts/${file[0]}-${Date.now()}.${file[1]}`;

  const command = new PutObjectCommand({
    Bucket: environment.AWS_S3_BUCKET,
    Key: fileKey,
    ContentType: fileType,
    ACL: "public-read",
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  res.json({ url, fileKey, fileType });
});

export default getPresignedUrl;

// const s3 = new AWS.S3({
//   //   accessKeyId: environment.AWS_S3_ACCESS_KEY_ID,
//   //   secretAccessKey: environment.AWS_S3_ACCESS_KEY_SECRET,
//   //   region: environment.AWS_S3_REGION,
//   // });

// const params = {
//   Bucket: environment.AWS_S3_BUCKET,
//   Key: fileKey,
//   Expires: 60, // URL expiry time in seconds
//   ContentType: fileType,
//   ACL: "public-read", // make the file publicly readable
// };

// s3.getSignedUrl("putObject", params, (err, url) => {
//   if (err) {
//     return res.status(500).json({ error: "Error generating pre-signed URL" });
//   }
// });