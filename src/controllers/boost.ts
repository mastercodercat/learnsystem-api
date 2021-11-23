import express, { Request, Response } from "express";
import rs from "randomstring";

import logger from "../utils/logger";
import db from "../db";

export const fetchAll = async (req: Request, res: Response) => {
  try {
    const boosts = await db.v2_boost.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return res.json({ boosts });
  } catch (error) {
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
        code: {
          create: {
            code,
            type: "boost",
          },
        },
      },
    });

    return res.json({ strategy });
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

    return res.json({ boost });
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

    const updated = await db.v2_boost.update({
      where: {
        id: parsedId,
      },
      data: {
        ...boost,
      },
    });

    return res.json({ boost: updated });
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

    return res.json({ boost: deleted });
  } catch (error) {
    logger.error(error);
    return res.status(400).json(error);
  }
};
