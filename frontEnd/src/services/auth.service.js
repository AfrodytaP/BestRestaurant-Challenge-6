import axios from "axios";

const API_URL = `http://localhost:8000/auth`;

const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, {
      username,
      password,
      email,
    });

    return response.data;
  } catch (error) {
    return { error: error.response.data.message };
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
    return { error: error.response.data.message };
  }
};

const logout = () => {
  localStorage.removeItem(`user`);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(`user`));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
