import { Router } from "express";
import BookingController from "../controllers/booking.controller.js";

export default class BookingRoutes {
  #controller;
  #router;
  #routeStartPoint;

  constructor(controller = new BookingController(), routeStartPoint = "/") {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#initialiseRoutes();
  }

  #initialiseRoutes = () => {
    this.#router.post("/add", this.#controller.addBooking);
    this.#router.get(
      "/getAllById/:userId",
      this.#controller.getBookingsByUserId
    );
    this.#router.get("/getAll", this.#controller.getAllBookings);
    this.#router.delete("/delete/:bookingId", this.#controller.cancelBooking);
    this.#router.get("/:bookingId", this.#controller.getBooking);
    this.#router.put("/edit/:bookingId", this.#controller.updateBooking);
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
