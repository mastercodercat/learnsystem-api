import express from "express";
import passport from "passport";
import "../services/passport";

const routes = express.Router();
const requireAuth = passport.authenticate("jwt", { session: false });

routes.get("/", requireAuth, (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: req.user });
});

export default routes;
