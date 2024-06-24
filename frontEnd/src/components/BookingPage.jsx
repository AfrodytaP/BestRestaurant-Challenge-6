import React from "react";
import BookingForm from "./BookingForm";
import authService from "../services/auth.service";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { getCurrentUser } = authService;
  const currentUser = getCurrentUser();
  const { bookingId } = useParams();

  return (
    <div>
      <h1>Booking Page</h1>
      <BookingForm currentUser={currentUser} bookingIdToUpdate={bookingId} />
    </div>
  );
};

export default BookingPage;
