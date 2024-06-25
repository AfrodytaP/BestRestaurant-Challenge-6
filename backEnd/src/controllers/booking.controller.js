import {
  addBookingService,
  getBookingsByUserIdService,
  getAllBookingsService,
  cancelBookingService,
  updateBookingById,
  getBookingByBookingId,
} from "../services/booking.services.js";

export const addBooking = async (req, res) => {
  try {
    const { userId, date, time, numberOfPeople } = req.body;

    const newBooking = await addBookingService(
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

export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await getBookingsByUserIdService(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await getAllBookingsService(date);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await cancelBookingService(bookingId);
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await getBookingByBookingId(bookingId);

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

export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { date, time, numberOfPeople } = req.body;

  try {
    const updatedBooking = await updateBookingById(
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
