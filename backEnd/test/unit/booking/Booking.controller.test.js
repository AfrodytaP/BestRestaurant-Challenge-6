import { expect } from "chai";
import sinon from "sinon";

import BookingController from "../../../src/controllers/Booking.controller.js";

describe("BookingController", () => {
  let bookingController;
  let bookingService;
  let req;
  let res;

  beforeEach(() => {
    bookingService = {
      addBookingService: sinon.stub(),
      getBookingsByUserIdService: sinon.stub(),
      getAllBookingsService: sinon.stub(),
      cancelBookingService: sinon.stub(),
      getBookingByBookingId: sinon.stub(),
      updateBookingById: sinon.stub(),
    };

    bookingController = new BookingController(bookingService);

    req = {};
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  });

  describe("addBooking Tests", () => {
    it("should add a booking successfully", async () => {
      const newBooking = {
        id: "1",
        userId: "user123",
        date: "2024-06-30",
        time: "10:00 AM",
        numberOfPeople: 5,
      };
      bookingService.addBookingService.resolves(newBooking);

      req.body = {
        userId: "user123",
        date: "2024-06-30",
        time: "10:00 AM",
        numberOfPeople: 5,
      };

      await bookingController.addBooking(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Booking added successfully.",
          booking: newBooking,
        })
      ).to.be.true;
    });

    it("should send a 500 response if addBookingService throws an error", async () => {
      const testError = new Error("Test error");
      bookingService.addBookingService.rejects(testError);

      req.body = {
        userId: "user123",
        date: "2024-06-30",
        time: "10:00 AM",
        numberOfPeople: 5,
      };

      await bookingController.addBooking(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
    });
  });

  describe("getBookingsByUserId Tests", () => {
    it("should get bookings by user ID successfully", async () => {
      const userId = "user123";
      const bookings = [
        {
          id: "1",
          userId,
          date: "2024-06-30",
          time: "10:00 AM",
          numberOfPeople: 5,
        },
      ];
      bookingService.getBookingsByUserIdService.resolves(bookings);

      req.params = { userId };

      await bookingController.getBookingsByUserId(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(bookings)).to.be.true;
    });

    it("should send a 500 response if getBookingsByUserIdService throws an error", async () => {
      const testError = new Error("Test error");
      bookingService.getBookingsByUserIdService.rejects(testError);

      req.params = { userId: "user123" };

      await bookingController.getBookingsByUserId(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
    });
  });

  describe("getAllBookings Tests", () => {
    it("should get all bookings for the specified date and return them as json", async () => {
      const date = "2024-06-30";
      const bookings = [
        {
          id: "1",
          userId: "user123",
          date,
          time: "10:00 AM",
          numberOfPeople: 5,
        },
        {
          id: "2",
          userId: "user456",
          date,
          time: "12:00 PM",
          numberOfPeople: 2,
        },
      ];
      bookingService.getAllBookingsService.resolves(bookings);

      req.query = { date };

      await bookingController.getAllBookings(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(bookings)).to.be.true;
    });

    it("should send a 500 response if getAllBookingsService throws an error", async () => {
      const testError = new Error("Test error");
      bookingService.getAllBookingsService.rejects(testError);

      req.query = { date: "2024-06-30" };

      await bookingController.getAllBookings(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
    });

    it("should return an empty array if there are no bookings for the specified date", async () => {
      const bookings = [];
      bookingService.getAllBookingsService.resolves(bookings);

      req.query = { date: "2024-06-30" };

      await bookingController.getAllBookings(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(bookings)).to.be.true;
    });
  });

  describe("cancelBooking Tests", () => {
    it("should cancel a booking successfully and return a success message", async () => {
      // Arrange
      bookingService.cancelBookingService.resolves();

      req.params = { bookingId: "1" };

      // Act
      await bookingController.cancelBooking(req, res);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Booking canceled successfully" }))
        .to.be.true;
    });

    it("should send a 500 response if cancelBookingService throws an error", async () => {
      const testError = new Error("Test error");
      bookingService.cancelBookingService.rejects(testError);

      req.params = { bookingId: "1" };

      await bookingController.cancelBooking(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
    });

    it("should send a 400 response if bookingId is not provided", async () => {
      req.params = {}; 

      await bookingController.cancelBooking(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          message: "bookingId is required",
        })
      ).to.be.true;
    });
  });

  describe("getBooking Tests", () => {
    it("should fetch a booking successfully and return the booking details", async () => {
      // Arrange
      const booking = {
        _id: "12345",
        date: "2023-06-01",
        time: "18:00",
        numberOfPeople: 4,
        userId: "user123",
      };
      bookingService.getBookingByBookingId.resolves(booking);

      req.params = { bookingId: "12345" };

      // Act
      await bookingController.getBooking(req, res);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Booking fetched successfully",
          booking: {
            id: booking._id,
            date: booking.date,
            time: booking.time,
            numberOfPeople: booking.numberOfPeople,
            userId: booking.userId,
          },
        })
      ).to.be.true;
    });

    it("should return a 404 response if the booking is not found", async () => {
      // Arrange
      bookingService.getBookingByBookingId.resolves(null);

      req.params = { bookingId: "12345" };

      // Act
      await bookingController.getBooking(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Booking not found" })).to.be.true;
    });

    it("should return a 500 response if there is an error", async () => {
      // Arrange
      const testError = new Error("Test error");
      bookingService.getBookingByBookingId.rejects(testError);

      req.params = { bookingId: "12345" };

      // Act
      await bookingController.getBooking(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Failed to fetch booking",
          error: testError.message,
        })
      ).to.be.true;
    });
  });

  describe("updateBooking Tests", () => {
    it("should update a booking successfully and return the updated booking details", async () => {
      // Arrange
      const updatedBooking = {
        _id: "12345",
        date: "2023-07-01",
        time: "19:00",
        numberOfPeople: 5,
        userId: "user123",
      };
      bookingService.updateBookingById.resolves(updatedBooking);

      req.params = { bookingId: "12345" };

      // Mock req.body
      req.body = {
        date: "2023-07-01",
        time: "19:00",
        numberOfPeople: 5,
      };

      // Act
      await bookingController.updateBooking(req, res);

      // Assert
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Booking updated successfully",
          booking: updatedBooking,
        })
      ).to.be.true;
    });

    it("should return a 404 response if the booking is not found", async () => {
      // Arrange
      bookingService.updateBookingById.resolves(null);

      req.params = { bookingId: "12345" };

      // Mock req.body
      req.body = {
        date: "2023-07-01",
        time: "19:00",
        numberOfPeople: 5,
      };

      // Act
      await bookingController.updateBooking(req, res);

      // Assert
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Booking not found" })).to.be.true;
    });

    it("should return a 500 response if there is an error", async () => {
      // Arrange
      const testError = new Error("Test error");
      bookingService.updateBookingById.rejects(testError);

      req.params = { bookingId: "12345" };

      req.body = {
        date: "2023-07-01",
        time: "19:00",
        numberOfPeople: 5,
      };

      // Act
      await bookingController.updateBooking(req, res);

      // Assert
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Failed to update booking",
          error: testError.message,
        })
      ).to.be.true;
    });
  });
});
