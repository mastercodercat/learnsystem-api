import express from "express";

import {
  fetchAll,
  createLift,
  fetchLift,
  updateLift,
  deleteLift,
} from "../../controllers/lift";
import { generateCode, getCode } from "../../middlewares/helpers";
import { upload } from "../../middlewares/upload";

const routes = express.Router();

routes.get("", fetchAll);
routes.post("", generateCode, upload.single("image"), createLift);
routes.get("/:id", fetchLift);
routes.put("/:id", getCode, upload.single("image"), updateLift);
routes.delete("/:id", deleteLift);

export default routes;
