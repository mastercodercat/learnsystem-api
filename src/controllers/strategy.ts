import express from "express";

import db from "../db";

export const fetchAll = async (req: express.Request, res: express.Response) => {
  try {
    const strategies = await db.v2_code.findMany({});
    return res.json({ strategies });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

export const fetchStrategy = async (
  req: express.Request,
  res: express.Response
) => {};
