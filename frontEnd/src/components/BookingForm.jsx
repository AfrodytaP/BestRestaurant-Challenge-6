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
    const month = String(date.getMonth() + 1).padStart(2, "0");
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

  const generateTimeSlots = (startTime, endTime, interval) => {
    const timeSlots = [];
    let currentTime = startTime;

    while (currentTime <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(timeString);
      currentTime += interval;
    }

    return timeSlots;
  };

  const allowedTimeSlots = generateTimeSlots(720, 1290, 15);

  const isDateInPast = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const isTimeInPast = (date, time) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return selectedDateTime < now;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDateInPast(date)) {
      setError("You cannot select a date in the past.");
      return;
    }

    if (isTimeInPast(date, time)) {
      setError("You cannot select a time that has already passed.");
      return;
    }

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
    <div className="booking-container">
      <div className="booking-form-container">
        <h2 className="mb-4 text-light text-center">Make a Booking</h2>
        <div className="bookingForm" data-testid="mockBookingForm">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <label
                htmlFor="date"
                className="col-sm-4 col-form-label text-light"
              >
                Date:
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="time"
                className="col-sm-4 col-form-label text-light"
              >
                Time:
              </label>
              <div className="col-sm-8">
                <select
                  className="form-control"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {allowedTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {/* <input
              className="form-control"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            /> */}
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="numberOfPeople"
                className="col-sm-4 col-form-label text-light"
              >
                Number of People:
              </label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  id="numberOfPeople"
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
            <div className="d-flex justify-content-center">
              <button className="btn" type="submit">
                {isUpdateMode ? "Update Booking" : "Book Now"}
              </button>
            </div>
          </form>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
