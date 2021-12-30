import express, { Request, Response } from "express";

import { v2_lift_cognitive_eval } from "@prisma/client";
import logger from "../utils/logger";
import { upload, saveFile } from "../utils/aws";
import { getVideoSuffix } from "../utils/text-utils";
import db from "../db";
import config from "../config";

export const fetchAll = async (req: Request, res: Response) => {
  try {
    const lifts = await db.$queryRaw`
      SELECT v2_lift.*, v2_code.code from v2_lift
      LEFT JOIN v2_code ON v2_lift.id = v2_code.ref_id AND v2_code.type = 'lift'
    `;
    return res.json({ lifts });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ error });
  }
};

export const createLift = async (req, res) => {
  const { image, ...lift } = req.body;

  try {
    let data = {
      ...lift,
      video: getVideoSuffix(lift.video),
      cognitive_eval: v2_lift_cognitive_eval[lift.cognitive_eval],
    };

    if (req.file) {
      data = {
        ...data,
        media: `${req.code}.png`,
      };
    }

    const strategy = await db.v2_lift.create({
      data,
    });
    const vCode = await db.v2_code.create({
      data: {
        type: "lift",
        code: req.code,
        ref_id: strategy.id,
      },
    });

    const url = `${config.appSiteUrl}/lift/${req.code}`;

    await saveFile(`${config.appQRCodeUrl}&data=${url}`, "code.png");
    await upload(
      "code.png",
      `${config.awsStrategyName}/${config.awsQRCodeName}/${req.code}.png`
    );

    return res.json({
      ...strategy,
      code: req.code,
    });
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const fetchLift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    const lift = await db.v2_lift.findFirst({
      where: {
        id: parsedId,
      },
    });

    return res.json(lift);
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};

export const updateLift = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const {
      code,
      image,
      id: liftId,
      created_at,
      updated_at,
      deleted_at,
      ...lift
    } = req.body;
    let data = {
      ...lift,
      video: getVideoSuffix(lift.video),
      cognitive_eval: v2_lift_cognitive_eval[lift.cognitive_eval],
    };
    if (req.file) {
      data = {
        ...data,
        media: `${req.code}.png`,
      };
    }

    const updated = await db.v2_lift.update({
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

export const deleteLift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    const deleted = await db.v2_lift.delete({
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
