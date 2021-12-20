import dotenv from "dotenv";

dotenv.config();

export default {
  // application configurations
  appName: process.env.APP_NAME || "MindPrint API",
  appPort: process.env.APP_PORT || 3000,
  appPubKey: process.env.APP_PUB_KEY || "mindprintlearning",
  appSiteUrl:
    process.env.APP_MAIN_SITE_URL ||
    "https://markdown-data.d1d2rt93o39ov3.amplifyapp.com",
  appQRCodeUrl:
    process.env.APP_QRCODE_URL ||
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200",

  awsAccessKey: process.env.AWS_ACCESS_KEY || "",
  awsRegion: process.env.AWS_REGION || "",
  awsSecretKey: process.env.AWS_SECRET_KEY || "",
  awsMediaUrl: process.env.AWS_MEDIA_URL || "",
  awsBucketName: process.env.AWS_S3_BUCKET_NAME || "",
  awsStrategyName: process.env.AWS_S3_STRATEGY_NAME || "",
  awsQRCodeName: process.env.AWS_S3_QRCODE_NAME || "",

  // database configurations
  databaseHost:
    process.env.DATABASE_HOST || "development.mindprintlearning.com",
  databasePort: process.env.DATABASE_PORT || 3306,
  databaseName: process.env.DATABASE_NAME || "application_dev",
  databaseUser: process.env.DATABASE_USERNAME || "root",
  databasePassword: process.env.DATABASE_PASSWORD || "yygn6%5BXkE%23vJbx",
};
