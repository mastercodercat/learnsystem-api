import passport, { authenticate } from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

import db from "../db";
import { getPublicKey } from "../utils/auth";

// setting the jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getPublicKey(),
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = await db.v2_users.findUnique({
    where: {
      id: payload.sub,
    },
  });

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// tell passport to use defined strategies:
passport.use(jwtLogin);
