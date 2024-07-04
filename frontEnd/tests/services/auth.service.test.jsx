import axios from "axios";
import AuthService from "../../src/services/auth.service";

const API_URL = "https://bestrestaurant-challenge-6-be.onrender.com/auth";

vi.mock("axios");

describe("Authentication Service Tests", () => {
  describe("register tests", () => {
    const mockUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    it("should register a new user successfully", async () => {
      // Arrange
      const mockResponse = {
        data: { message: "User registered successfully" },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await AuthService.register(
        mockUser.username,
        mockUser.email,
        mockUser.password
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/user/register`, {
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should return an error message if registration fails", async () => {
      // Arrange
      const errorMessage = "Username already exists";
      const error = { response: { data: { message: errorMessage } } };
      axios.post.mockRejectedValueOnce(error);

      // Act
      const result = await AuthService.register(
        mockUser.username,
        mockUser.email,
        mockUser.password
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/user/register`, {
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(result).toEqual({ error: errorMessage });
    });

    it("should return a generic error message if the error message is not provided", async () => {
      // Arrange
      const errorMessage = "An error occurred while registering";

      axios.post.mockRejectedValueOnce({
        response: undefined,
      });

      // Act
      const result = await AuthService.register(
        "username",
        "email@example.com",
        "password"
      );

      // Assert
      expect(result).toEqual({ error: errorMessage });
    });
  });

  describe("login tests", () => {
    const mockUser = {
      username: "testuser",
      password: "testpassword",
    };

    it("should login successfully and set user in localStorage", async () => {
      // Arrange
      const mockResponse = {
        data: {
          accessToken: "mockAccessToken",
          message: "Login successful",
        },
      };

      beforeEach(() => {
        localStorage.clear();
      });
      axios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await AuthService.login(
        mockUser.username,
        mockUser.password
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/user/login`, {
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(localStorage.getItem("user")).toEqual(
        JSON.stringify(mockResponse.data)
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should return an error message if login fails", async () => {
      // Arrange
      const errorMessage = "Invalid username or password";
      const error = { response: { data: { message: errorMessage } } };
      axios.post.mockRejectedValueOnce(error);

      // Act
      const result = await AuthService.login(
        mockUser.username,
        mockUser.password
      );

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/user/login`, {
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(localStorage.getItem("user")).toBeNull();
      expect(result).toEqual({ error: errorMessage });
    });

    it("should return a generic error message if the error message is not provided", async () => {
      // Arrange
      const errorMessage = "An error occurred while logging in";

      axios.post.mockRejectedValueOnce({
        response: undefined,
      });

      // Act
      const result = await AuthService.login("username", "password");

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/user/login`, {
        username: "username",
        password: "password",
      });
      expect(localStorage.getItem("user")).toBeNull();
      expect(result).toEqual({ error: errorMessage });
    });
  });

  describe("logout tests", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should return null if no user is stored in localStorage", () => {
      // Act
      const user = AuthService.getCurrentUser();

      // Assert
      expect(user).toBeNull();
    });

    it("should remove user from localStorage on logout", () => {
      // Arrange
      localStorage.setItem("user", JSON.stringify({ username: "testuser" }));

      // Act
      AuthService.logout();

      // Assert
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("getCurrentUser tests", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should return null if no user is stored in localStorage", () => {
      // Act
      const user = AuthService.getCurrentUser();

      // Assert
      expect(user).toBeNull();
    });

    it("should return the user stored in localStorage", () => {
      // Arrange
      const mockUser = { username: "testuser", email: "testuser@example.com" };
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Act
      const user = AuthService.getCurrentUser();

      // Assert
      expect(user).toEqual(mockUser);
    });

    it("should return null if user data in localStorage is invalid", () => {
      localStorage.setItem("user", "invalidJSONData");

      // Act
      const user = AuthService.getCurrentUser();

      // Assert
      expect(user).toBeNull();
    });
  });

  describe("getUserById function", () => {
    it("fetches successfully user details from API", async () => {
      const mockUserId = 123;
      const mockUserData = { id: mockUserId, name: "John Doe" };
      axios.get.mockResolvedValue({ data: mockUserData });

      const user = await AuthService.getUserById(mockUserId);

      // Assertions
      expect(user).toEqual(mockUserData);
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/user/${mockUserId}`);
    });

    it("throws an error if API request fails", async () => {
      const mockUserId = 456;
      const errorMessage = "User not found";
      axios.get.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(AuthService.getUserById(mockUserId)).rejects.toThrow(
        errorMessage
      );
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/user/${mockUserId}`);
    });

    it("throws a generic error message if no specific error message is returned by API", async () => {
      const mockUserId = 789;
      axios.get.mockRejectedValue({});

      await expect(AuthService.getUserById(mockUserId)).rejects.toThrow(
        "An error occurred while fetching the user details"
      );
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/user/${mockUserId}`);
    });
  });

  describe("changePassword function", () => {
    const oldPassword = "oldPassword123";
    const newPassword = "newPassword123";

    beforeEach(() => {
      localStorage.clear();
    });

    it("changes password successfully", async () => {
      const token = "mockAccessToken";
      localStorage.setItem("accessToken", token);

      const mockResponse = { message: "Password changed successfully" };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await AuthService.changePassword(oldPassword, newPassword);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/user/changePassword`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    it("throws an error if no token is available", async () => {
      await expect(
        AuthService.changePassword(oldPassword, newPassword)
      ).rejects.toThrow("No token available. User is not authenticated.");
    });

    it("throws an error if the API request fails", async () => {
      const token = "mockAccessToken";
      localStorage.setItem("accessToken", token);

      const errorMessage = "Old password is incorrect";
      axios.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(
        AuthService.changePassword(oldPassword, newPassword)
      ).rejects.toThrow(errorMessage);
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/user/changePassword`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    it("throws a generic error message if no specific error message is returned by API", async () => {
      const token = "mockAccessToken";
      localStorage.setItem("accessToken", token);

      axios.post.mockRejectedValue({});

      await expect(
        AuthService.changePassword(oldPassword, newPassword)
      ).rejects.toThrow("An error occurred while changing the password");
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/user/changePassword`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });
  });
});
