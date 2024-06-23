import { Router } from "express";
import {
  addBooking,
  getBookingsByUserId,
  getAllBookings,
  cancelBooking,
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
  };

  getRouter = () => {
    return this.#router;
  };
}
