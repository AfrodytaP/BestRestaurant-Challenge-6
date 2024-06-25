import { Router } from "express";
import { body } from "express-validator";
import middlewareConfig from "../middlewares/middleware.js";
import {
  userLoginController,
  userRegisterController,
  userChangePasswordController,
  userGetByIDController,
} from "../controllers/auth.controller.js";

export default class AuthRoutes {
  #router;

  constructor() {
    this.#router = Router();
    this.#initializeRoutes();
  }

  #initializeRoutes = () => {
    const { verifySignUp, verifyToken, isManager } = middlewareConfig;

    this.#router.use((req, res, next) => {
      res.header(
        `Access-Control-Allow-Headers`,
        `x-access-token, Origin, Content-Type, Accept`
      );
      next();
    });

    this.#router.post(
      "/user/register",
      [
        body("email").exists().normalizeEmail().escape().isEmail(),
        body("username").exists().escape(),
        body("password").exists().escape(),
        verifySignUp.checkDuplicateUsernameOrEmail,
      ],
      userRegisterController
    );

    this.#router.post(
      "/user/login",
      [body("username").exists().escape(), body("password").exists().escape()],
      userLoginController
    );

    this.#router.post(
      "/user/changePassword",
      [
        verifyToken,
        body("oldPassword").exists().escape(),
        body("newPassword").exists().escape(),
      ],
      userChangePasswordController
    );

    this.#router.get("/user/:userId", userGetByIDController);
  };

  getRouter = () => {
    return this.#router;
  };
}
