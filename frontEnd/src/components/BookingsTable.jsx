import React, { useEffect, useState } from "react";
import {
  getBookingsByUserId,
  getAllBookings,
} from "../services/booking.service";
import authService from "../services/auth.service";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [userRole, setUserRole] = useState(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setUserRole(currentUser.role);
        if (currentUser.role === "manager") {
          const data = await getAllBookings(filterDate);
          setBookings(data);
        } else {
          const data = await getBookingsByUserId(currentUser.id);
          setBookings(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBookings();
  }, [filterDate]);

  const handleFilter = async () => {
    try {
      if (userRole === "manager") {
        const data = await getAllBookings(filterDate);
        setBookings(data);
      } else {
        const data = await getBookingsByUserId(currentUser.id);
        setBookings(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Bookings </h1>
      {error && <div className="error">{error}</div>}
      {userRole === "manager" && (
        <div>
          <label>Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button onClick={handleFilter}>Filter</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Number of People</th>
            {userRole === "manager" && <th>Actions</th>}
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
