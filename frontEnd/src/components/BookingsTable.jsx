import React, { useEffect, useState } from "react";
import {
  getBookingsByUserId,
  getAllBookings,
  cancelBooking,
} from "../services/booking.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [userRole, setUserRole] = useState(null);
  const currentUser = authService.getCurrentUser();
  const [filteredDate, setFilteredDate] = useState("");
  const navigate = useNavigate();

  const fetchBookings = async (dateFilter = "") => {
    try {
      setUserRole(currentUser.role);
      if (currentUser.role === "manager") {
        const data = await getAllBookings(dateFilter);
        const bookingsWithUserEmails = await Promise.all(
          data.map(async (booking) => {
            const user = await authService.getUserById(booking.userId);
            return { ...booking, email: user.email };
          })
        );
        setBookings(bookingsWithUserEmails);
      } else {
        const data = await getBookingsByUserId(currentUser.id);
        setBookings(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchBookings(filteredDate);
  }, [filteredDate]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilter = async () => {
    try {
      setFilteredDate(filterDate);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReset = async () => {
    try {
      setFilterDate("");
      setFilteredDate("");
      await fetchBookings("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (bookingId) => {
    navigate(`/makeBookings/${bookingId}`);
  };

  return (
    <div>
      <h1 className="mt-4 mb-4 text-light ">Bookings </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {userRole === "manager" && (
        <div className="row mb-4">
          <label className="me-2 text-light mb-4">Filter by Date:</label>
          <div className="col-sm-2">
            <input
              className="form-control me-2 mb-4"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <button className="btn btn-primary me-2" onClick={handleFilter}>
              Filter
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      )}
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Number of People</th>
            {userRole === "manager" && <th>Email</th>}
            {userRole === "manager" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.time}</td>
              <td>{booking.numberOfPeople}</td>
              {userRole === "manager" && <td>{booking.email}</td>}
              {userRole === "manager" && (
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(booking._id)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
