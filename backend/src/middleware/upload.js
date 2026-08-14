import multer from "multer";
import config from "../config/env.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.uploads.maxFileSizeBytes,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (config.uploads.allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Unsupported image type "${file.mimetype}"`
      )
    );
  },
});

export default upload;
