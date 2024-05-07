import { writeAsyncIterableToWritable } from "@remix-run/node";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY_CLOUDINARY as string,
  api_secret: process.env.API_SECRET_CLOUDINARY as string,
});
1;
async function uploadImage(
  data: AsyncIterable<Uint8Array>
): Promise<UploadApiResponse> {
  const uploadPromise = new Promise(
    async (resolve: (value: any) => void, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "livied_store",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      await writeAsyncIterableToWritable(data, uploadStream);
    }
  );

  return uploadPromise;
}

export { uploadImage };
