import express from "express";

import {
  fetchAll,
  createBoost,
  fetchBoost,
  updateBoost,
  deleteBoost,
} from "../../controllers/boost";
import { generateCode, getCode } from "../../middlewares/helpers";
import { upload } from "../../middlewares/upload";

const routes = express.Router();

routes.get("", fetchAll);
routes.post("", generateCode, upload.single("image"), createBoost);
routes.get("/:id", fetchBoost);
routes.put("/:id", getCode, upload.single("image"), updateBoost);
routes.delete("/:id", deleteBoost);

export default routes;
