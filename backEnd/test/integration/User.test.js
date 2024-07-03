import { expect } from "chai";
import supertest from "supertest";
import express from "express";
import Server from "../../src/server/Server.js";
import bcrypt from "bcrypt";
import Config from "../../src/config/Config.js";
import Database from "../../src/db/Database.js";
import User from "../../src/models/user.model.js";
import UserController from "../../src/controllers/User.controller.js";
import UserRoutes from "../../src/routes/User.routes.js";
import UserService from "../../src/services/User.services.js";

const testUsers = [
  {
    username: "testuser1",
    email: "testuser1@example.com",
    password: "password123",
    role: "customer",
  },
  {
    username: "testuser2",
    email: "testuser2@example.com",
    password: "password456",
    role: "customer",
  },
];

describe("User Integration Tests", () => {
  let server;
  let request;

  before(async () => {
    const userRouter = express.Router();
    const userService = new UserService();
    const userController = new UserController(userService);
    const authRoutes = new UserRoutes(userController);
    userRouter.use(authRoutes.getRouteStartPoint(), authRoutes.getRouter());

    server = new Server(3000, "localhost", [
      { path: "/auth", router: userRouter },
    ]);
    await server.start();
    request = supertest(server.getApp());
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    await User.deleteMany();
    await User.insertMany(
      testUsers.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password, 8),
      }))
    );
  });

  describe("GET /auth/user/:userId", () => {
    it("should return a user by ID", async () => {
      const user = await User.findOne({ username: "testuser1" });
      const response = await request.get(`/auth/user/${user._id}`);
      expect(response.status).to.equal(200);
      expect(response.body.username).to.equal("testuser1");
    });
  });
});
