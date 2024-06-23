import { verifyToken, isManager } from "./authJwt.js";
import verifySignUp from "./verifySignUp.js";

const middlewareConfig = { verifyToken, isManager, verifySignUp };

export default middlewareConfig;
