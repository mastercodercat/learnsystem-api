import express from "express";
import rs from "randomstring";

import logger from "../utils/logger";
import db from "../db";

export const fetchAll = async (req: express.Request, res: express.Response) => {
  try {
    const strategies = await db.v2_boost.findMany({
      orderBy: {
        title: "asc",
      },
    });
    return res.json({ strategies });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const createBoost = async (
  req: express.Request,
  res: express.Response
) => {
  const { boost } = req.body;
  console.log("boost", boost);

  try {
    let code = "";
    let isExisting = null;
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

    const strategy = await db.v2_boost.create({
      data: {
        ...boost,
        code: {
          create: {
            code,
            type: "boost",
          },
        },
      },
    });

    console.log(strategy);

    return res.json({ strategy });
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const fetchStrategy = async (
  req: express.Request,
  res: express.Response
) => {};
