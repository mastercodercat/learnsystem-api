import express from "express";

import {
  fetchAll,
  createBoost,
  fetchBoost,
  updateBoost,
  deleteBoost,
} from "../../controllers/boost";

const routes = express.Router();

routes.get("", fetchAll);
routes.post("", createBoost);
routes.get("/:id", fetchBoost);
routes.put("/:id", updateBoost);
routes.delete("/:id", deleteBoost);

export default routes;
