import axios from "axios";

const API_URL = "http://localhost:8000/booking";

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
