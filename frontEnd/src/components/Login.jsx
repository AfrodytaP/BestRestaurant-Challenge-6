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
          <div className="card card-container">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
            />

            <form onSubmit={handleLogin} ref={form}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                />
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  type="submit"
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
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
  );
};

export default Login;
