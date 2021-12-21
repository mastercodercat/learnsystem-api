import rs from "randomstring";
import { v2_code } from "@prisma/client";
import db from "../db";

export const getVideoSuffix = (video: string) => {
  if (!video) {
    return "";
  }
  if (video.split("watch?v=").length < 2) {
    return video;
  }
  return video.split("watch?v=")[1];
};

export const generateCode = async () => {
  let code = "";
  let isExisting: v2_code | null = null;
  do {
    code = rs.generate({
      length: 4,
      charset: "0123456789abcdefghjkmnpqrstuvwxyz",
    });
    isExisting = await db.v2_code.findFirst({
      where: {
        code,
      },
    });
  } while (!!isExisting);

  return code;
};
