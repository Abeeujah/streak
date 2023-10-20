import fs from "fs";
import multer from "multer";

const imageFormats = [
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
];

const storage = multer.diskStorage({
  destination(req, file, callback) {
    fs.mkdir("./uploads/", (err) => {
      callback(null, "./uploads/");
    });
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (imageFormats.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
