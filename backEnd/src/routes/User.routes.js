import { Router } from "express";
import { body } from "express-validator";
import middlewareConfig from "../middlewares/middleware.js";
import UserController from "../controllers/User.controller.js";

export default class UserRoutes {
  #controller;
  #router;
  #routeStartPoint;

  constructor(controller = new UserController(), routeStartPoint = "/") {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#initializeRoutes();
  }

  #initializeRoutes = () => {
    const { verifySignUp, verifyToken } = middlewareConfig;

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
      this.#controller.userRegisterController
    );

    this.#router.post(
      "/user/login",
      [body("username").exists().escape(), body("password").exists().escape()],
      this.#controller.userLoginController
    );

    this.#router.post(
      "/user/changePassword",
      [
        verifyToken,
        body("oldPassword").exists().escape(),
        body("newPassword").exists().escape(),
      ],
      this.#controller.userChangePasswordController
    );

    this.#router.get("/user/:userId", this.#controller.userGetByIDController);
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
