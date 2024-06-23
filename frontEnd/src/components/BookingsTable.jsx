import React, { useEffect, useState } from "react";
import { getBookingsByUserId } from "../services/booking.service";
import authService from "../services/auth.service";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const data = await getBookingsByUserId(currentUser.id);
        setBookings(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Number of People</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.time}</td>
              <td>{booking.numberOfPeople}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
