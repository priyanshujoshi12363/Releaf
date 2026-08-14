import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import config from "../config/env.js";
import { ApiError } from "./ApiError.js";
import logger from "./logger.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploadOnCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", ...options },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload failed", { message: error.message });
          return reject(ApiError.internal("Image upload failed"));
        }
        if (!result?.secure_url) {
          return reject(ApiError.internal("Image upload returned no URL"));
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export const destroyFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.warn("Cloudinary cleanup failed", { publicId, message: error.message });
  }
};

export { cloudinary };
