import path from "path";
import fs from "fs";

import config from "../config";

export const getPublicKey = () => {
  const pathToKey = path.join(config.appPubKey);
  return fs.readFileSync(pathToKey, "utf8");
};
