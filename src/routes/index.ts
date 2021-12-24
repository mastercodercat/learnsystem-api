import express from "express";
import passport from "passport";
import "../services/passport";

import boosts from "./boost";
import lifts from "./lift";

const routes = express.Router();
const requireAuth = passport.authenticate("jwt", { session: false });

routes.get("/", requireAuth, (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: req.user });
});

routes.use("/boosts", requireAuth, boosts);
routes.use("/lifts", requireAuth, lifts);

export default routes;
