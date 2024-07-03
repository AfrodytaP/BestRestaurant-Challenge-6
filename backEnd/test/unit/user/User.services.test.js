import { expect } from "chai";
import sinon from "sinon";
import User from "../../../src/models/user.model.js";
import UserService from "../../../src/services/User.services.js";

describe("UserService", function () {
  let findStub;
  let findByIdStub;
  let userService;

  beforeEach(() => {
    findStub = sinon.stub(User, "find");
    findByIdStub = sinon.stub(User, "findById");
    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getAllUsersService", function () {
    it("should return all users", async () => {
      // Arrange
      const mockUsers = [
        { _id: "1", email: "user1@example.com" },
        { _id: "2", email: "user2@example.com" },
      ];
      findStub.resolves(mockUsers);

      // Act
      const result = await userService.getAllUsersService();

      // Assert
      expect(result).to.deep.equal(mockUsers);
      expect(findStub.calledOnce).to.be.true;
    });

    it("should handle errors when fetching all users", async () => {
      // Arrange
      const errorMessage = "Database error";
      findStub.rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await userService.getAllUsersService();
        throw new Error("Expected getAllUsersService to throw an error");
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
        expect(findStub.calledOnce).to.be.true;
      }
    });
  });

  describe("getUserByIDService", function () {
    it("should return a user by ID", async () => {
      // Arrange
      const userId = "1";
      const mockUser = { _id: userId, email: "user1@example.com" };
      findByIdStub.withArgs(userId, "email").resolves(mockUser);

      // Act
      const result = await userService.getUserByIDService(userId);

      // Assert
      expect(result).to.deep.equal(mockUser);
      expect(findByIdStub.calledOnceWithExactly(userId, "email")).to.be.true;
    });

    it("should handle 'User not found' when fetching a user by non-existent ID", async () => {
      // Arrange
      const nonExistentUserId = "999";
      findByIdStub.withArgs(nonExistentUserId, "email").resolves(null);

      // Act & Assert
      try {
        await userService.getUserByIDService(nonExistentUserId);
        throw new Error("Expected getUserByIDService to throw an error");
      } catch (error) {
        expect(error.message).to.equal("Unable to fetch user: User not found");
        expect(findByIdStub.calledOnceWithExactly(nonExistentUserId, "email"))
          .to.be.true;
      }
    });

    it("should handle errors when fetching a user by ID", async () => {
      // Arrange
      const userId = "1";
      const errorMessage = "Database error";
      findByIdStub.withArgs(userId, "email").rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await userService.getUserByIDService(userId);
        throw new Error("Expected getUserByIDService to throw an error");
      } catch (error) {
        expect(error.message).to.equal(`Unable to fetch user: ${errorMessage}`);
        expect(findByIdStub.calledOnceWithExactly(userId, "email")).to.be.true;
      }
    });
  });
});
