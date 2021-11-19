import express from "express";

import {
  fetchAll,
  fetchStrategy,
  createBoost,
} from "../../controllers/strategy";

const routes = express.Router();

routes.get("/boost", fetchAll);
routes.get("/:id", fetchStrategy);
routes.post("/boost", createBoost);

export default routes;
