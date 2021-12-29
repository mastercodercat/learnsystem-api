import { nextTick } from "process";
import { generateCode as generate } from "../utils/text-utils";
import db from "../db";

export const generateCode = async (req, res, next) => {
  const code = await generate();
  req.code = code;
  next();
};

export const getCode = (type: "boost" | "lift") => async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  const code = await db.v2_code.findFirst({
    where: {
      ref_id: parsedId,
      type: type,
    },
  });

  req.code = code?.code;
  next();
};
