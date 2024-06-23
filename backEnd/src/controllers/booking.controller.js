import {
  addBookingService,
  getBookingsByUserIdService,
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
