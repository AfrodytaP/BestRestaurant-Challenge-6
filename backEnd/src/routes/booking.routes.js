import { Router } from "express";
import {
  addBooking,
  getBookingsByUserId,
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
  };

  getRouter = () => {
    return this.#router;
  };
}
