import express, { Request, Response } from "express";
import rs from "randomstring";
import axios from "axios";

import { v2_boost_cognitive_eval } from "@prisma/client";
import logger from "../utils/logger";
import { getVideoSuffix } from "../utils/text-utils";
import db from "../db";
import config from "../config";

export const fetchAll = async (req: Request, res: Response) => {
  try {
    const boosts = await db.v2_boost.findMany({
      include: {
        code: {
          select: {
            code: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return res.json({ boosts });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ error });
  }
};

export const createBoost = async (req: Request, res: Response) => {
  const { boost } = req.body;

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
        video: getVideoSuffix(boost.video),
        cognitive_eval: v2_boost_cognitive_eval[boost.cognitive_eval],
        code: {
          create: {
            code,
            type: "boost",
          },
        },
      },
    });

    const url = `${config.appSiteUrl}/boost/${code}`;
    const response = await axios.get(`${config.appQRCodeUrl}&data=${url}`);

    return res.json(strategy);
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const fetchBoost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    const boost = await db.v2_boost.findFirst({
      where: {
        id: parsedId,
      },
    });

    return res.json(boost);
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const updateBoost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const { boost } = req.body;
    const { code, ...newBoost } = boost;

    const updated = await db.v2_boost.update({
      where: {
        id: parsedId,
      },
      data: {
        ...newBoost,
      },
    });

    return res.json(updated);
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const deleteBoost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    const deleted = await db.v2_boost.delete({
      where: {
        id: parsedId,
      },
    });

    return res.json(deleted);
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};
