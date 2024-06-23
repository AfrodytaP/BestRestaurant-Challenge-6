import Booking from "../models/booking.model.js";

export const addBookingService = async (userId, date, time, numberOfPeople) => {
  try {
    const newBooking = new Booking({
      userId,
      date,
      time,
      numberOfPeople,
    });

    await newBooking.save();

    return newBooking;
  } catch (error) {
    throw new Error(`Unable to add booking: ${error.message}`);
  }
};

export const getBookingsByUserIdService = async (userId) => {
  try {
    const bookings = await Booking.find({ userId });
    return bookings;
  } catch (error) {
    throw new Error(`Unable to fetch bookings: ${error.message}`);
  }
};

export const getAllBookingsService = async (date) => {
  try {
    const filter = date ? { date: new Date(date) } : {};
    const bookings = await Booking.find(filter);
    return bookings;
  } catch (error) {
    throw new Error(`Unable to fetch bookings: ${error.message}`);
  }
};
