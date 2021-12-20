import { nextTick } from "process";
import { generateCode as generate } from "../utils/text-utils";
import db from "../db";

export const generateCode = async (req, res, next) => {
  const code = await generate();
  req.code = code;
  next();
};

export const getCode = async (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  const boost = await db.v2_boost.findFirst({
    where: {
      id: parsedId,
    },
    include: {
      code: {
        select: {
          code: true,
        },
      },
    },
  });

  req.code = boost?.code?.code;
  next();
};
