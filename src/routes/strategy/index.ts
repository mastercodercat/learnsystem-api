import express from "express";

import { fetchAll, fetchStrategy } from "../../controllers/strategy";

const routes = express.Router();

routes.get("/", fetchAll);
routes.get("/:id", fetchStrategy);

export default routes;
