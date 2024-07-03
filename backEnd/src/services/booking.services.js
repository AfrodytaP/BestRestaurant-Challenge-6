import Booking from "../models/booking.model.js";
export default class BookingService {
  addBookingService = async (userId, date, time, numberOfPeople) => {
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

  getBookingsByUserIdService = async (userId) => {
    try {
      const bookings = await Booking.find({ userId });
      // }
      return bookings;
    } catch (error) {
      throw new Error(`Unable to fetch bookings: ${error.message}`);
    }
  };

  getAllBookingsService = async (date) => {
    try {
      const filter = date ? { date: new Date(date) } : {};
      const bookings = await Booking.find(filter);
      return bookings;
    } catch (error) {
      throw new Error(`Unable to fetch bookings: ${error.message}`);
    }
  };

  cancelBookingService = async (bookingId) => {
    try {
      await Booking.findByIdAndDelete(bookingId);
    } catch (error) {
      throw new Error(`Unable to cancel booking: ${error.message}`);
    }
  };

  getBookingByBookingId = async (bookingId) => {
    try {
      const booking = await Booking.findById(bookingId);
      return booking;
    } catch (error) {
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }
  };

  updateBookingById = async (bookingId, date, time, numberOfPeople) => {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { date, time, numberOfPeople },
        { new: true }
      );

      return updatedBooking;
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  };
}
