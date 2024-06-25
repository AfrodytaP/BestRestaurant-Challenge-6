import React, { useState } from "react";
import AuthService from "../services/auth.service";
import ValidationServiceHelpers from "../services/validation.serviceHelpers";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    const errors = [];

    const oldPasswordErrors = ValidationServiceHelpers.required(oldPassword);
    if (oldPasswordErrors) {
      errors.push(oldPasswordErrors);
    }

    const newPasswordErrors =
      ValidationServiceHelpers.required(newPassword) ||
      ValidationServiceHelpers.vpassword(newPassword);
    if (newPasswordErrors) {
      errors.push(newPasswordErrors);
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      const data = await AuthService.changePassword(oldPassword, newPassword);
      setMessage(data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-6">
          <div className="card bg-dark text-white card-container">
            <div className="card-body">
              <h2 className="mt-6">Change Password</h2>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-white"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-white"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{
                      backgroundColor: "#0d111c",
                      borderColor: "#0d111c",
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
