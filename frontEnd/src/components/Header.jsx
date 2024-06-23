import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ currentUser, logOut }) => {
  return (
    <nav className="header navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to="/home" className="navbar-brand">
          <img src={logo} alt="DFCorp logo" width="100" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/home" className="nav-link">
                Home
              </Link>
            </li>
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                {currentUser.role === "manager" ? (
                  <>
                    <li className="nav-item">
                      <Link to="/allBooking" className="nav-link">
                        All Booking
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/makeBookings" className="nav-link">
                        Make a booking
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/myBookings" className="nav-link">
                        My Bookings
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
