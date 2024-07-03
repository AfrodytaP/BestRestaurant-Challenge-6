import axios from "axios";

const API_URL = "http://localhost:8000/booking";
// const API_URL = process.env.REACT_APP_BOOKING_API_URL;

export const addBooking = async (userId, date, time, numberOfPeople) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      userId,
      date,
      time,
      numberOfPeople,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while adding the booking"
    );
  }
};

export const getBookingsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getAllById/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the bookings"
    );
  }
};

export const getAllBookings = async (filterDate) => {
  try {
    const url = filterDate
      ? `${API_URL}/getAll?date=${filterDate}`
      : `${API_URL}/getAll`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the bookings"
    );
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while cancelling the booking"
    );
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(`${API_URL}/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the booking"
    );
  }
};

export const updateBooking = async (bookingId, date, time, numberOfPeople) => {
  try {
    const response = await axios.put(`${API_URL}/edit/${bookingId}`, {
      date,
      time,
      numberOfPeople,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while updating the booking"
    );
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while fetching the user details"
    );
  }
};
