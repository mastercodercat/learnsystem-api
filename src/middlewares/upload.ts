import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/aws";
import config from "../config";

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.awsBucketName,
    key: function (req, file, cb) {
      cb(null, `${config.awsStrategyName}/${req.code}.png`);
    },
  }),
});
