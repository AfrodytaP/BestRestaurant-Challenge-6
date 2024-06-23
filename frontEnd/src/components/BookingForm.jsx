import React, { useState } from "react";
import { addBooking } from "../services/booking.service";

const BookingForm = ({ currentUser }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setSuccessMessage("");

      const response = await addBooking(
        currentUser.id,
        date,
        time,
        numberOfPeople
      );

      if (response.message === "Booking added successfully.") {
        setSuccessMessage(response.message);
      }

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of People:</label>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            required
          >
            <option value="">Select number of people</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <button type="submit">Book Now</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
    </div>
  );
};

export default BookingForm;
