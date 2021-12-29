import express, { Request, Response } from "express";

import { v2_boost_cognitive_eval } from "@prisma/client";
import logger from "../utils/logger";
import { upload, saveFile } from "../utils/aws";
import { getVideoSuffix } from "../utils/text-utils";
import db from "../db";
import config from "../config";

export const fetchAll = async (req: Request, res: Response) => {
  try {
    const boosts = await db.$queryRaw`
      SELECT v2_boost.*, v2_code.code from v2_boost
      LEFT JOIN v2_code ON v2_boost.id = v2_code.ref_id AND v2_code.type = 'boost'
    `;
    return res.json({ boosts });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ error });
  }
};

export const createBoost = async (req, res) => {
  const { image, ...boost } = req.body;

  try {
    let data = {
      ...boost,
      video: getVideoSuffix(boost.video),
      cognitive_eval: v2_boost_cognitive_eval[boost.cognitive_eval],
    };

    if (req.file) {
      data = {
        ...data,
        media: `${req.code}.png`,
      };
    }

    const strategy = await db.v2_boost.create({
      data,
    });
    const vCode = await db.v2_code.create({
      data: {
        code: req.code,
        type: "boost",
        ref_id: strategy.id,
      },
    });

    const url = `${config.appSiteUrl}/boost/${req.code}`;

    await saveFile(`${config.appQRCodeUrl}&data=${url}`, "code.png");
    await upload(
      "code.png",
      `${config.awsStrategyName}/${config.awsQRCodeName}/${req.code}.png`
    );

    return res.json({
      ...strategy,
      code: vCode,
    });
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

export const updateBoost = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const {
      code,
      image,
      id: boostId,
      created_at,
      updated_at,
      deleted_at,
      ...boost
    } = req.body;
    let data = {
      ...boost,
      video: getVideoSuffix(boost.video),
      cognitive_eval: v2_boost_cognitive_eval[boost.cognitive_eval],
    };
    if (req.file) {
      data = {
        ...data,
        media: `${req.code}.png`,
      };
    }

    const updated = await db.v2_boost.update({
      where: {
        id: parsedId,
      },
      data,
    });

    return res.json({
      ...updated,
      code: req.code,
    });
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
