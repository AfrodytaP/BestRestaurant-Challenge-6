import { Router } from "express";
import {
  addBooking,
  getBookingsByUserId,
  getAllBookings,
  cancelBooking,
  getBooking,
  updateBooking,
} from "../controllers/booking.controller.js";

export default class BookingRoutes {
  #router;

  constructor() {
    this.#router = Router();
    this.#initializeRoutes();
  }

  #initializeRoutes = () => {
    this.#router.post("/add", addBooking);
    this.#router.get("/getAllById/:userId", getBookingsByUserId);
    this.#router.get("/getAll", getAllBookings);
    this.#router.delete("/delete/:bookingId", cancelBooking);
    this.#router.get("/:bookingId", getBooking);
    this.#router.put("/edit/:bookingId", updateBooking);
  };

  getRouter = () => {
    return this.#router;
  };
}
