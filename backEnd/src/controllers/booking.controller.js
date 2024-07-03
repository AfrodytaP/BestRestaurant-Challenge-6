import BookingService from "../services/booking.services.js";
export default class BookingController {
  #service;

  constructor(service = new BookingService()) {
    this.#service = service;
  }

  addBooking = async (req, res) => {
    try {
      const { userId, date, time, numberOfPeople } = req.body;

      if (!userId || !date || !time || !numberOfPeople) {
        return res.status(400).json({ message: "Invalid request body" });
      }

      const newBooking = await this.#service.addBookingService(
        userId,
        date,
        time,
        numberOfPeople
      );

      res
        .status(201)
        .json({ message: "Booking added successfully.", booking: newBooking });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getBookingsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const bookings = await this.#service.getBookingsByUserIdService(userId);
      if (!bookings || bookings.length === 0) {
        return res
          .status(404)
          .json({ message: "No bookings found for user ID" });
      }
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getAllBookings = async (req, res) => {
    try {
      const { date } = req.query;
      let bookings;
      if (!date) {
        bookings = await this.#service.getAllBookingsService();
      } else {
        bookings = await this.#service.getAllBookingsService(date);
      }
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  cancelBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json({ message: "bookingId is required" });
      }

      await this.#service.cancelBookingService(bookingId);
      res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getBooking = async (req, res) => {
    const { bookingId } = req.params;
    console.log(bookingId);

    try {
      const booking = await this.#service.getBookingByBookingId(bookingId);
      console.log(booking);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json({
        message: "Booking fetched successfully",
        booking: {
          id: booking._id,
          date: booking.date,
          time: booking.time,
          numberOfPeople: booking.numberOfPeople,
          userId: booking.userId,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch booking", error: error.message });
    }
  };

  updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { date, time, numberOfPeople } = req.body;

    try {
      const updatedBooking = await this.#service.updateBookingById(
        bookingId,
        date,
        time,
        numberOfPeople
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json({
        message: "Booking updated successfully",
        booking: updatedBooking,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update booking", error: error.message });
    }
  };
}
