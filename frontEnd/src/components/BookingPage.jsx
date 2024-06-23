import React from "react";
import BookingForm from "./BookingForm";
import authService from "../services/auth.service";

const BookingPage = () => {
  const { getCurrentUser } = authService;
  const currentUser = getCurrentUser();

  return (
    <div>
      <h1>Booking Page</h1>
      <BookingForm currentUser={currentUser} />
    </div>
  );
};

export default BookingPage;
