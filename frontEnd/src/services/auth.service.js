import axios from "axios";

const API_URL = `http://localhost:8000/auth`;
// const API_URL = process.env.REACT_APP_AUTH_API_URL;

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, {
      username,
      password,
      email,
    });

    return response.data;
  } catch (error) {
    if (!error.response) {
      return { error: "An error occurred while registering" };
    }
    return {
      error: error.response.data.message,
    };
  }
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      username,
      password,
    });

    console.log(response.data);
    if (response.data.accessToken) {
      localStorage.setItem(`user`, JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    if (!error.response) {
      return { error: "An error occurred while logging in" };
    }
    return { error: error.response.data.message };
  }
};

const logout = () => {
  localStorage.removeItem(`user`);
};

const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(`user`);
    if (!userData) {
      return null;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the user details"
    );
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No token available. User is not authenticated.");
  }

  try {
    const response = await axios.post(
      `${API_URL}/user/changePassword`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while changing the password"
    );
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getUserById,
  changePassword,
};

export default authService;
