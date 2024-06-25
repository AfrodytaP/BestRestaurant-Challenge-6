import React, { useState, useEffect } from "react";
import {
  addBooking,
  updateBooking,
  getBookingById,
} from "../services/booking.service";

const BookingForm = ({ currentUser, bookingIdToUpdate }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    if (bookingIdToUpdate) {
      setIsUpdateMode(true);
      fetchBookingDetails(bookingIdToUpdate);
    }
  }, [bookingIdToUpdate]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const booking = await getBookingById(bookingId);

      setDate(formatDate(booking.booking.date || ""));
      setTime(booking.booking.time || "");
      setNumberOfPeople(
        booking.booking.numberOfPeople
          ? booking.booking.numberOfPeople.toString()
          : ""
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setSuccessMessage("");

      if (isUpdateMode) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreate = async () => {
    const response = await addBooking(
      currentUser.id,
      date,
      time,
      numberOfPeople
    );
    if (response.message === "Booking added successfully.") {
      setSuccessMessage(response.message);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    const response = await updateBooking(
      bookingIdToUpdate,
      date,
      time,
      numberOfPeople
    );
    if (response.message === "Booking updated successfully") {
      setSuccessMessage(response.message);
    }
  };

  const resetForm = () => {
    setDate("");
    setTime("");
    setNumberOfPeople("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-light ">Make a Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          <label className="col-sm-2 col-form-label text-light">Date:</label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-4">
          <label className="col-sm-2 col-form-label text-light">Time:</label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-4">
          <label className="col-sm-2 col-form-label text-light">
            Number of People:
          </label>
          <div className="col-sm-2">
            <select
              className="form-select"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              required
            >
              <option value="">Select number of people</option>
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" type="submit">
          {isUpdateMode ? "Update Booking" : "Book Now"}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
    </div>
  );
};

export default BookingForm;
