import { verifyToken, isManager } from "./authJwt.js";
import { checkDuplicateUsernameOrEmail } from "./verifySignUp.js";

const middlewareConfig = {
  verifyToken,
  isManager,
  verifySignUp: {
    checkDuplicateUsernameOrEmail,
  },
};

export default middlewareConfig;
