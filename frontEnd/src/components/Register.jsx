import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import ValidationServiceHelpers from "../services/validation.serviceHelpers";

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const errors = [];

    const usernameErrors =
      ValidationServiceHelpers.required(username) ||
      ValidationServiceHelpers.vusername(username);
    if (usernameErrors) {
      errors.push(usernameErrors);
    }

    const emailErrors =
      ValidationServiceHelpers.required(email) ||
      ValidationServiceHelpers.validEmail(email);
    if (emailErrors) {
      errors.push(emailErrors);
    }

    const passwordErrors =
      ValidationServiceHelpers.required(password) ||
      ValidationServiceHelpers.vpassword(password);
    if (passwordErrors) {
      errors.push(passwordErrors);
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    const errors = validateForm();

    if (errors.length === 0) {
      try {
        const response = await AuthService.register(username, email, password);
        if (response.message) {
          sessionStorage.setItem("signupMessage", response.message);
          setSuccessful(true);
          navigate("/login");
        } else {
          setMessage(response.error);
          setSuccessful(false);
        }
      } catch (error) {
        setMessage(error.toString());
        setSuccessful(false);
      }
    } else {
      setMessage(errors.join(", "));
      setSuccessful(false);
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
            <form onSubmit={handleRegister} ref={formRef}>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      className="form-control"
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
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

export default Register;
