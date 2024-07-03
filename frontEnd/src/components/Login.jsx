import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../services/auth.service";

const Login = ({ setCurrentUser }) => {
  const form = useRef();
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  useEffect(() => {
    const signupMessage = sessionStorage.getItem("signupMessage");
    if (signupMessage) {
      setMessage(signupMessage);
      sessionStorage.removeItem("signupMessage");
      setIsSuccessMessage(true);
    }
  }, []);

  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      setLoading(false);
      return;
    }

    const login = await AuthService.login(username, password);

    if (login.accessToken) {
      const accessToken = login.accessToken;
      localStorage.setItem("accessToken", accessToken);
      const token = localStorage.getItem("accessToken");
      console.log("login.accessToken", token);

      setCurrentUser(AuthService.getCurrentUser());
      navigate("/");
    } else {
      const errorMessage =
        typeof login.error === "string"
          ? login.error
          : "An error occurred during login.";
      setMessage(errorMessage);
      setLoading(false);
      setIsSuccessMessage(false);
    }
  };

  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-6">
          <div className="card bg-dark text-white card-container">
            <div className="card-body">
              <div className="text-center mb-3">
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                  style={{ width: "100px", borderRadius: "50%" }}
                />
              </div>
              <form onSubmit={handleLogin} ref={form}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="form-control bg-dark text-white"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control bg-dark text-white"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                  />
                </div>
                <div className="form-group mb-3 text-center">
                  <button
                    className="btn btn-primary btn-block"
                    disabled={loading}
                    type="submit"
                    style={{
                      backgroundColor: "#0d111c",
                      borderColor: "#0d111c",
                    }}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>

                {message && (
                  <div className="form-group mb-3">
                    <div
                      className={
                        isSuccessMessage
                          ? "alert alert-success"
                          : "alert alert-danger"
                      }
                      role="alert"
                    >
                      {message}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
