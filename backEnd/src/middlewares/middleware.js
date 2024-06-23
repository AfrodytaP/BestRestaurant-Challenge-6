import verifyToken from "./authJwt.js";
import verifySignUp from "./verifySignUp.js";

const middlewareConfig = { verifyToken, verifySignUp };

export default middlewareConfig;
