import { Router } from "express";
import { addBooking } from "../controllers/booking.controller.js";

export default class BookingRoutes {
  #router;

  constructor() {
    this.#router = Router();
    this.#initializeRoutes();
  }

  #initializeRoutes = () => {
    this.#router.post("/add", addBooking);
  };

  getRouter = () => {
    return this.#router;
  };
}
