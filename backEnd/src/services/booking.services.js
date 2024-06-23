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
