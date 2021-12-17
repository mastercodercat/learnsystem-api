import multer from "multer";
import AWS from "aws-sdk";
import fs from "fs";
import axios from "axios";
import config from "../config";

AWS.config.update({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretKey,
  region: "us-east-1",
});

const s3 = new AWS.S3();

export const saveFile = async (url: string, target) => {
  const response = await axios({
    method: "get",
    url,
    responseType: "stream",
  });
  const save = () =>
    new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(target);
      response.data.pipe(writer);
      writer.on("close", () => {
        resolve(true);
      });
      writer.on("error", (err) => {
        writer.close();
        reject(err);
      });
    });
  await save();
};

export const upload = (source, target) =>
  new Promise((resolve, reject) => {
    fs.readFile(source, (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        const putParams = {
          Bucket: "mindprint-general",
          Key: target,
          Body: fileData,
        };
        s3.putObject(putParams, function (error, data) {
          if (error) {
            reject(error);
          } else {
            fs.unlink(source, (linkError) => {
              if (linkError) {
                reject(linkError);
              }
              resolve(data);
            });
          }
        });
      }
    });
  });
