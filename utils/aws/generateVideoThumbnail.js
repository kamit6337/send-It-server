import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PassThrough } from "stream";
import ffmpeg from "fluent-ffmpeg";
import s3Client from "./awsS3.js";
import { environment } from "../environment.js";

const generateVideoThumbnail = async (videoUrl) => {
  const thumbnailKey = `thumbnails/image-${Date.now()}.png`;

  // Create a PassThrough stream for the thumbnail data
  const passThroughStream = new PassThrough();

  // Setup S3 upload stream
  const command = new PutObjectCommand({
    Bucket: environment.AWS_S3_BUCKET,
    Key: thumbnailKey,
    Body: passThroughStream,
    ContentType: "image/png",
    ACL: "public-read",
  });

  // Upload the thumbnail to S3
  const uploadPromise = s3Client.send(command);

  return new Promise((resolve, reject) => {
    // Generate thumbnail from video URL and pipe to S3 upload stream
    ffmpeg(videoUrl)
      .screenshots({
        count: 1,
        size: "320x240",
        filename: "thumbnail.png", // Filename is required but won't be used
      })
      .on("end", async () => {
        try {
          await uploadPromise; // Ensure upload completes
          const mediaUrl = `https://${environment.AWS_S3_BUCKET}.s3.amazonaws.com/${thumbnailKey}`;
          resolve(mediaUrl);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .pipe(passThroughStream, { end: true }); // Pipe thumbnail directly to S3
  });
};

export default generateVideoThumbnail;
