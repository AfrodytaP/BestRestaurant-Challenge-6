import React from "react";
import BookingForm from "./BookingForm";
import authService from "../services/auth.service";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const currentUser = authService.getCurrentUser();
  const { bookingId } = useParams();

  return (
    <div>
      <BookingForm currentUser={currentUser} bookingIdToUpdate={bookingId} />
    </div>
  );
};

export default BookingPage;
