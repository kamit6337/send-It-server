import { PassThrough } from "stream";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import s3Client from "./awsS3.js";
import { environment } from "../environment.js";

const generateImageThumbnail = async (imagePath) => {
  const passThroughStream = new PassThrough();
  const thumbnailKey = `thumbnails/image-${Date.now()}.png`;

  // Setup S3 upload stream
  const command = new PutObjectCommand({
    Bucket: environment.AWS_S3_BUCKET,
    Key: thumbnailKey,
    Body: passThroughStream,
    ContentType: "image/png",
    ACL: "public-read", // Makes the file publicly accessible
  });

  const uploadPromise = s3Client.send(command);

  return new Promise((resolve, reject) => {
    sharp(imagePath)
      .resize(320, 240) // Resize the image to the desired thumbnail size
      .png() // Convert the image to PNG format (or any other format if needed)
      .on("error", (err) => {
        passThroughStream.end(); // Close the stream on error
        reject(err);
      })
      .pipe(passThroughStream) // Pipe the processed image to the PassThrough stream
      .on("end", async () => {
        try {
          await uploadPromise;
          const mediaUrl = `https://${environment.AWS_S3_BUCKET}.s3.amazonaws.com/${thumbnailKey}`;
          resolve(mediaUrl);
        } catch (err) {
          reject(err);
        }
      });
  });
};

export default generateImageThumbnail;
