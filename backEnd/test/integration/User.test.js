// import { expect } from "chai";
// import supertest from "supertest";
// import express from "express";
// import Server from "../../src/server/Server.js";
// import bcrypt from "bcrypt";
// import Config from "../../src/config/Config.js";
// import Database from "../../src/db/Database.js";
// import User from "../../src/models/user.model.js";
// import UserController from "../../src/controllers/User.controller.js";
// import UserRoutes from "../../src/routes/User.routes.js";
// import UserService from "../../src/services/user.services.js";

// const testUsers = [
//   {
//     username: "testuser1",
//     email: "testuser1@example.com",
//     password: "password123",
//     role: "customer",
//   },
//   {
//     username: "testuser2",
//     email: "testuser2@example.com",
//     password: "password456",
//     role: "customer",
//   },
// ];

// describe("User Integration Tests", () => {
//   let server;
//   let request;
//   let database;

//   before(async () => {
//     const userRouter = express.Router();
//     const userService = new UserService();
//     const userController = new UserController(userService);
//     const authRoutes = new UserRoutes(userController);
//     database = new Database(MONGO_URI);
//     userRouter.use(authRoutes.getRouteStartPoint(), authRoutes.getRouter());

//     server = new Server(3000, "localhost", [
//       { path: "/auth", router: userRouter },
//     ]);
//     await server.start();
//     request = supertest(server.getApp());
//   });

//   after(async () => {
//     await server.close();
//   });

//   beforeEach(async () => {
//     await User.deleteMany();
//     await User.insertMany(
//       testUsers.map((user) => ({
//         ...user,
//         password: bcrypt.hashSync(user.password, 8),
//       }))
//     );
//   });

//   describe("GET /auth/user/:userId", () => {
//     it("should return a user by ID", async () => {
//       const user = await User.findOne({ username: "testuser1" });
//       const response = await request.get(`/auth/user/${user._id}`);
//       expect(response.status).to.equal(200);
//       expect(response.body.username).to.equal("testuser1");
//     });
//   });
// });
import { expect } from "chai";
import supertest from "supertest";
import bcrypt from "bcrypt";
import Config from "../../src/config/Config.js";
import Database from "../../src/db/Database.js";
import User from "../../src/models/user.model.js";
import UserController from "../../src/controllers/User.controller.js";
import UserRoutes from "../../src/routes/User.routes.js";
import UserService from "../../src/services/user.services.js";
import Server from "../../src/server/Server.js";

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
  let userServer;
  let request;
  let database;

  before(async () => {
    Config.load();
    const { PORT, HOST, MONGO_URI } = process.env;

    database = new Database(MONGO_URI);
    await database.connect();

    const userService = new UserService();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);
    // const userRouter = express.Router();
    // userRouter.use(userRoutes.getRouteStartPoint(), userRoutes.getRouter());

    userServer = new Server(PORT, HOST, [
      { path: "/auth", router: userRoutes.getRouter() },
    ]);
    await userServer.start();
    request = supertest(userServer.getApp());
  });

  after(async () => {
    await userServer.close();
    await database.close();
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

  it("should register a new user", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "Newpassword123!",
      role: "customer",
    };

    const res = await request
      .post("/auth/user/register")
      .send(newUser)
      .expect(201);

    expect(res.body).to.have.property(
      "message",
      "User was registered successfully"
    );
  });

  it("should not register a user with an existing Username", async () => {
    const res = await request
      .post("/auth/user/register")
      .send(testUsers[0])
      .expect(400);

    expect(res.body).to.have.property(
      "message",
      "Failed! Username is already in use!"
    );
  });

  // it("should login a user with correct credentials", async () => {
  //   const res = await request
  //     .post("/auth/user/login")
  //     .send({
  //       email: testUsers[0].email,
  //       password: "password123",
  //     })
  //     .expect(200);

  //   expect(res.body).to.have.property("token");
  // });

  // it("should not login a user with incorrect credentials", async () => {
  //   const res = await request
  //     .post("/auth/user/login")
  //     .send({
  //       email: testUsers[0].email,
  //       password: "wrongpassword",
  //     })
  //     .expect(401);

  //   expect(res.body).to.have.property("message", "Invalid credentials");
  // });
});
