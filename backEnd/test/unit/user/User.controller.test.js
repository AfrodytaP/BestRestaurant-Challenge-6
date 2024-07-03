import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import User from "../../../src/models/user.model.js";
import UserController from "../../../src/controllers/User.controller.js";

describe("UserController - userRegisterController", () => {
  let userController;
  let userSaveStub;

  beforeEach(() => {
    userController = new UserController();
    userSaveStub = sinon.stub(User.prototype, "save");
  });

  afterEach(() => {
    sinon.restore();
    userSaveStub.restore();
  });

  it("should handle internal server errors", async () => {
    userSaveStub.rejects(new Error("Database error"));

    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await userController.userRegisterController(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Database error" })).to.be.true;
  });
});

describe("UserController", () => {
  let userController;
  let userServiceStub;

  beforeEach(() => {
    userServiceStub = {
      getAllUsersService: sinon.stub(),
      getUserByIDService: sinon.stub(),
    };

    userController = new UserController(userServiceStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("userGetDbController", () => {
    it("should fetch all users successfully", async () => {
      const users = [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ];

      userServiceStub.getAllUsersService.resolves(users);

      const req = {};
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      await userController.userGetDbController(req, res);

      sinon.assert.calledWith(res.json, users);
    });

    it("should handle errors when fetching all users fails", async () => {
      const errorMessage = "Database error";
      userServiceStub.getAllUsersService.rejects(new Error(errorMessage));

      const req = {};
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      await userController.userGetDbController(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: errorMessage });
    });
  });

  describe("userGetByIDController", () => {
    it("should return a user by ID", async () => {
      const user = { id: 1, username: "user1" };
      userServiceStub.getUserByIDService.withArgs("1").resolves(user);

      const req = { params: { userId: "1" } };
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      await userController.userGetByIDController(req, res);

      sinon.assert.calledWith(res.json, user);
    });

    it("should handle 'User not found' when fetching a non-existent user", async () => {
      const errorMessage = "User not found";
      userServiceStub.getUserByIDService
        .withArgs("invalidId")
        .rejects(new Error(errorMessage));

      const req = { params: { userId: "invalidId" } };
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      await userController.userGetByIDController(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: errorMessage });
    });
  });

  describe("userChangePasswordController", () => {
    it("should return 400 if oldPassword or newPassword is missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      await userController.userChangePasswordController(req, res);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(
        res.send.calledOnceWith({
          message: "Old password and new password are required.",
        })
      ).to.be.true;
    });

    it("should return 404 if user is not found", async () => {
      const req = {
        body: { oldPassword: "oldpass", newPassword: "newpass" },
        userId: "nonexistentid",
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      sinon.stub(User, "findById").resolves(null);

      await userController.userChangePasswordController(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.send.calledOnceWith({ message: "User not found." })).to.be
        .true;
    });

    it("should return 401 if old password is incorrect", async () => {
      const req = {
        body: { oldPassword: "wrongpass", newPassword: "newpass" },
        userId: "validuserid",
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      sinon
        .stub(User, "findById")
        .resolves({ password: bcrypt.hashSync("correctpass", 8) });

      await userController.userChangePasswordController(req, res);

      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.send.calledOnceWith({ message: "Invalid old password." })).to
        .be.true;
    });

    it("should change password and return 200 on success", async () => {
      const req = {
        body: { oldPassword: "correctpass", newPassword: "newpass" },
        userId: "validuserid",
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      const user = {
        password: bcrypt.hashSync("correctpass", 8),
        save: sinon.stub().resolves(),
      };
      sinon.stub(User, "findById").resolves(user);

      await userController.userChangePasswordController(req, res);

      expect(user.password).to.not.equal("correctpass");
      expect(user.save.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(
        res.send.calledOnceWith({
          message: "Password changed successfully.",
        })
      ).to.be.true;
    });

    it("should handle internal server error", async () => {
      const req = {
        body: { oldPassword: "correctpass", newPassword: "newpass" },
        userId: "validuserid",
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };

      sinon.stub(User, "findById").rejects(new Error("Database error"));

      await userController.userChangePasswordController(req, res);

      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.send.calledOnceWith({ message: "Database error" })).to.be.true;
    });
  });
});
