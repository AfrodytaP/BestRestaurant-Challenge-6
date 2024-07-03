import { expect } from "chai";
import sinon from "sinon";
import supertest from "supertest";
import Config from "../../src/config/Config.js";
import Database from "../../src/db/Database.js";
import Server from "../../src/server/Server.js";
import BookingController from "../../src/controllers/Booking.controller.js";
import BookingRoutes from "../../src/routes/Booking.routes.js";
import BookingService from "../../src/services/booking.services.js";

describe("Booking API Integration Tests", () => {
  let bookingServer;
  let bookingService;
  let database;
  let request;

  before(async () => {
    Config.load();
    const { PORT, HOST, MONGO_URI } = process.env;
    bookingService = new BookingService();
    const bookingController = new BookingController(bookingService);
    const bookingRoutes = new BookingRoutes(bookingController);
    database = new Database(MONGO_URI);

    try {
      await database.connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw new Error("Database connection error");
    }
    bookingService = new BookingService();
    bookingServer = new Server(PORT, HOST, [
      {
        path: "/booking",
        router: bookingRoutes.getRouter(),
      },
    ]);
    bookingServer.start();
    request = supertest(bookingServer.getApp());
    console.log("Test server started");
  });

  after(async () => {
    await bookingServer.close();
    await database.close();
    console.log("Test server and database connection closed");
  });

  beforeEach(async () => {
    try {
    } catch (error) {
      console.error("Error setting up test data:", error);
      throw new Error("Failed to set up test data");
    }
  });
  describe("GET /booking/:bookingId", () => {
    it("should retrieve a single booking by ID with status 200", async () => {
      const mockBooking = {
        _id: "6678c17eb5af6099dea699b9",
        userId: "66787cc8ca110581093c2f33",
        date: new Date("2024-06-28T00:00:00.000Z"),
        time: "23:43",
        numberOfPeople: 8,
      };
      const stub = sinon
        .stub(bookingService, "getBookingByBookingId")
        .resolves(mockBooking);

      const response = await request.get(`/booking/${mockBooking._id}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Booking fetched successfully");
      expect(response.body.booking.id).to.equal(mockBooking._id);
      expect(response.body.booking.date).to.equal(
        mockBooking.date.toISOString()
      );
      expect(response.body.booking.time).to.equal(mockBooking.time);
      expect(response.body.booking.numberOfPeople).to.equal(
        mockBooking.numberOfPeople
      );
      expect(response.body.booking.userId).to.equal(mockBooking.userId);

      stub.restore();
    });

    it("should respond with status 404 for non-existent booking ID", async () => {
      const nonExistentId = "5c8b1abfcb16d5a5a4e284c9";
      const response = await request.get(`/booking/${nonExistentId}`);
      console.log(response.body);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("Booking not found");
    });

    it("should respond with a 500 status if there is an error fetching booking", async () => {
      const stub = sinon
        .stub(bookingService, "getBookingByBookingId")
        .throws(new Error("Test error"));

      const response = await request.get("/booking/errorFetchingBooking");

      expect(response.status).to.equal(500);
      expect(response.body.message).to.equal("Failed to fetch booking");

      stub.restore();
    });
  });

  describe("POST /booking/add", () => {
    it("should add a new booking and respond with status 201", async () => {
      const mockBooking = {
        userId: "66787cc8ca110581093c2f33",
        date: new Date("2024-06-28T00:00:00.000Z"),
        time: "23:43",
        numberOfPeople: 8,
      };

      const stub = sinon
        .stub(bookingService, "addBookingService")
        .resolves(mockBooking);

      const response = await request.post("/booking/add").send(mockBooking);

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Booking added successfully.");
      expect(response.body.booking.userId).to.equal(mockBooking.userId);
      expect(response.body.booking.date).to.equal(
        mockBooking.date.toISOString()
      );
      expect(response.body.booking.time).to.equal(mockBooking.time);
      expect(response.body.booking.numberOfPeople).to.equal(
        mockBooking.numberOfPeople
      );

      stub.restore();
    });

    it("should respond with status 500 if there is an error adding the booking", async () => {
      const stub = sinon
        .stub(bookingService, "addBookingService")
        .throws(new Error("Test error"));

      const mockBooking = {
        userId: "66787cc8ca110581093c2f33",
        date: "2024-06-28T00:00:00.000Zppp",
        time: "23:43",
        numberOfPeople: 8,
      };

      const response = await request.post("/booking/add").send(mockBooking);

      expect(response.status).to.equal(500);
      expect(response.body.message).to.equal(
        `Unable to add booking: Booking validation failed: date: Cast to date failed for value "2024-06-28T00:00:00.000Zppp" (type string) at path "date"`
      );

      stub.restore();
    });

    it("should respond with status 400 if request body is invalid", async () => {
      const invalidBooking = {
        userId: "66787cc8ca110581093c2f33",
      };

      const response = await request.post("/booking/add").send(invalidBooking);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Invalid request body");
    });
  });

  describe("GET /booking/getAllById/:userId", () => {
    it("should retrieve bookings by user ID with status 200", async () => {
      const mockBooking = {
        _id: "667b0902cf913bb380176fac",
        userId: "667b08bbcf913bb380176fa7",
        date: new Date("2024-06-13T00:00:00.000Z"),
        time: "22:17",
        numberOfPeople: 5,
      };

      const stub = sinon
        .stub(bookingService, "getBookingsByUserIdService")
        .resolves([mockBooking]);

      const response = await request.get(
        `/booking/getAllById/${mockBooking.userId}`
      );

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      stub.restore();
    });

    it("should respond with status 404 for non-existent user ID", async () => {
      const nonExistentUserId = "66787cc8ca110581099999";
      const response = await request.get(
        `/booking/getAllById/${nonExistentUserId}`
      );
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal("No bookings found for user ID");
    });
  });
});
