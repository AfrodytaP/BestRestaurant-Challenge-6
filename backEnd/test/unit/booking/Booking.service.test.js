import { expect } from "chai";
import sinon from "sinon";
import BookingService from "../../../src/services/Booking.services.js";
import Booking from "../../../src/models/booking.model.js";

describe("BookingService", () => {
  let saveStub;
  let bookingService;
  let findStub;
  let findByIdStub;
  let findByIdAndDeleteStub;
  let findByIdAndUpdateStub;

  beforeEach(() => {
    saveStub = sinon.stub(Booking.prototype, "save");
    bookingService = new BookingService();
    findStub = sinon.stub(Booking, "find");
    findByIdStub = sinon.stub(Booking, "findById");
    findByIdAndDeleteStub = sinon.stub(Booking, "findByIdAndDelete");
    findByIdAndUpdateStub = sinon.stub(Booking, "findByIdAndUpdate");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("addBookingService", () => {
    it("should successfully add a booking", async () => {
      // Arrange
      const bookingService = new BookingService();
      const bookingData = {
        userId: "123",
        date: "2023-04-01",
        time: "18:00",
        numberOfPeople: 4,
      };
      saveStub.resolves(bookingData);

      // Act
      const result = await bookingService.addBookingService(
        bookingData.userId,
        bookingData.date,
        bookingData.time,
        bookingData.numberOfPeople
      );

      const resultData = {
        userId: result.userId,
        date: result.date.toISOString().split("T")[0],
        time: result.time,
        numberOfPeople: result.numberOfPeople,
      };

      // Assert
      expect(resultData).to.deep.equal(bookingData);
      sinon.assert.calledOnce(saveStub);
    });

    it("should throw an error if adding a booking fails", async () => {
      // Arrange
      const bookingService = new BookingService();
      const errorMessage = "Unable to add booking";
      saveStub.rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await bookingService.addBookingService("123", "2023-04-01", "18:00", 4);
        // If no error is thrown, fail the test
        expect.fail("Expected addBookingService to throw an error");
      } catch (error) {
        expect(error.message).to.include(errorMessage);
      }
    });
  });

  describe("getBookingsByUserIdService", () => {
    it("should fetch bookings by userId", async () => {
      // Arrange
      const bookingService = new BookingService();
      const userId = "123";
      const mockBookings = [
        { userId: "123", date: "2023-04-01", time: "18:00", numberOfPeople: 4 },
        { userId: "123", date: "2023-04-02", time: "19:00", numberOfPeople: 2 },
      ];
      findStub.withArgs({ userId }).resolves(mockBookings);

      // Act
      const result = await bookingService.getBookingsByUserIdService(userId);

      // Assert
      expect(result).to.deep.equal(mockBookings);
      sinon.assert.calledOnceWithExactly(findStub, { userId });
    });

    it("should throw an error if fetching bookings fails", async () => {
      // Arrange
      const bookingService = new BookingService();
      const userId = "456";
      const errorMessage = "Unable to fetch bookings";
      findStub.withArgs({ userId }).rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await bookingService.getBookingsByUserIdService(userId);
        expect.fail("Expected getBookingsByUserIdService to throw an error");
      } catch (error) {
        expect(error.message).to.include(errorMessage);
        sinon.assert.calledOnceWithExactly(findStub, { userId });
      }
    });
  });

  describe("getAllBookingsService", () => {
    it("should fetch all bookings when no date is provided", async () => {
      // Arrange
      const bookingService = new BookingService();
      const mockBookings = [
        { id: 1, date: "2023-04-01" },
        { id: 2, date: "2023-04-02" },
      ];
      findStub.resolves(mockBookings);

      // Act
      const result = await bookingService.getAllBookingsService();

      // Assert
      expect(result).to.deep.equal(mockBookings);
      sinon.assert.calledWith(findStub, {});
    });

    it("should fetch filtered bookings by date", async () => {
      // Arrange
      const bookingService = new BookingService();
      const mockDate = "2023-04-01";
      const mockBookings = [
        {
          userId: "123",
          date: new Date(mockDate),
          time: "18:00",
          numberOfPeople: 4,
        },
        {
          userId: "456",
          date: new Date(mockDate),
          time: "19:00",
          numberOfPeople: 2,
        },
      ];
      const filter = { date: new Date(mockDate) };
      findStub.withArgs(filter).resolves(mockBookings);

      // Act
      const result = await bookingService.getAllBookingsService(mockDate);

      // Assert
      expect(result).to.deep.equal(mockBookings);
      sinon.assert.calledOnceWithExactly(findStub, filter);
    });

    it("should throw an error if fetching bookings fails", async () => {
      // Arrange
      const bookingService = new BookingService();
      const mockDate = "2023-04-01";
      const filter = { date: new Date(mockDate) };
      const errorMessage = "Unable to fetch bookings";

      findStub.withArgs(filter).rejects(new Error(errorMessage));
      // Act & Assert
      try {
        await bookingService.getAllBookingsService(mockDate);
        expect.fail("Expected getAllBookingsService to throw an error");
      } catch (error) {
        // Assert
        expect(error.message).to.include(errorMessage);
        sinon.assert.calledOnceWithExactly(findStub, filter);
      }
    });
  });

  describe("cancelBookingService", function () {
    it("should successfully cancel a booking", async () => {
      // Arrange
      const bookingId = "12345";
      findByIdAndDeleteStub.withArgs(bookingId).resolves();

      // Act
      await bookingService.cancelBookingService(bookingId);

      // Assert
      expect(findByIdAndDeleteStub.calledOnceWithExactly(bookingId)).to.be.true;
    });

    it("should throw an error if canceling a booking fails", async () => {
      // Arrange
      const bookingId = "12345";
      const errorMessage = "Database error";
      findByIdAndDeleteStub
        .withArgs(bookingId)
        .rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await bookingService.cancelBookingService(bookingId);
        throw new Error("Expected cancelBookingService to throw an error");
      } catch (error) {
        expect(error.message).to.include(
          `Unable to cancel booking: ${errorMessage}`
        );
      }
    });
  });

  describe("getBookingByBookingId", function () {
    it("should successfully fetch a booking by bookingId", async () => {
      // Arrange
      const bookingId = "12345";
      const booking = { _id: bookingId, userId: "user123", date: new Date() };
      findByIdStub.withArgs(bookingId).resolves(booking);

      // Act
      const result = await bookingService.getBookingByBookingId(bookingId);

      // Assert
      expect(result).to.deep.equal(booking);
      expect(findByIdStub.calledOnceWithExactly(bookingId)).to.be.true;
    });

    it("should throw an error if fetching a booking by bookingId fails", async () => {
      // Arrange
      const bookingId = "12345";
      const errorMessage = "Database error";
      findByIdStub.withArgs(bookingId).rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await bookingService.getBookingByBookingId(bookingId);
        throw new Error("Expected getBookingByBookingId to throw an error");
      } catch (error) {
        expect(error.message).to.include(
          `Failed to fetch booking: ${errorMessage}`
        );
      }
    });
  });

  describe("updateBookingById", function () {
    it("should successfully update a booking by bookingId", async () => {
      // Arrange
      const bookingId = "12345";
      const date = new Date();
      const time = "18:00";
      const numberOfPeople = 4;
      const updatedBooking = { _id: bookingId, date, time, numberOfPeople };
      findByIdAndUpdateStub
        .withArgs(bookingId, { date, time, numberOfPeople }, { new: true })
        .resolves(updatedBooking);

      // Act
      const result = await bookingService.updateBookingById(
        bookingId,
        date,
        time,
        numberOfPeople
      );

      // Assert
      expect(result).to.deep.equal(updatedBooking);
      expect(
        findByIdAndUpdateStub.calledOnceWithExactly(
          bookingId,
          { date, time, numberOfPeople },
          { new: true }
        )
      ).to.be.true;
    });

    it("should throw an error if updating a booking by bookingId fails", async () => {
      // Arrange
      const bookingId = "12345";
      const date = new Date();
      const time = "18:00";
      const numberOfPeople = 4;
      const errorMessage = "Database error";
      findByIdAndUpdateStub
        .withArgs(bookingId, { date, time, numberOfPeople }, { new: true })
        .rejects(new Error(errorMessage));

      // Act & Assert
      try {
        await bookingService.updateBookingById(
          bookingId,
          date,
          time,
          numberOfPeople
        );
        throw new Error("Expected updateBookingById to throw an error");
      } catch (error) {
        expect(error.message).to.include(
          `Failed to update booking: ${errorMessage}`
        );
      }
    });
  });
});
