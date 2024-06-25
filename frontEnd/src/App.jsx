import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import AuthService from "../src/services/auth.service";

import Header from "../src/components/Header";
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import Footer from "../src/components/Footer";
import BookingPage from "./components/BookingPage";
import BookingsTable from "./components/BookingsTable";
import ChangePassword from "./components/ChangePassword";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header currentUser={currentUser} logOut={logOut} />
      <div className="background-image">
        <div className="container mt-3" style={{ flex: 1 }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/makeBookings" element={<BookingPage />} />
            <Route path="/makeBookings/:bookingId" element={<BookingPage />} />
            <Route
              path="/myBookings"
              element={<BookingsTable currentUser={currentUser} />}
            />
            <Route
              path="/allBookings"
              element={<BookingsTable currentUser={currentUser} />}
            />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route
              path="/login"
              element={<Login setCurrentUser={setCurrentUser} />}
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
