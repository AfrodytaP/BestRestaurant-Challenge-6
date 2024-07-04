import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

import BookingForm from "../src/components/BookingForm.jsx";
import * as bookingService from "../src/services/booking.service";
vi.mock("../services/booking.service.js");

vi.spyOn(bookingService, "getBookingById").mockResolvedValue({
  booking: {
    date: "2024-07-10",
    time: "13:30",
    numberOfPeople: 4,
  },
});

vi.spyOn(bookingService, "addBooking").mockResolvedValue({
  message: "Booking added successfully.",
});

vi.spyOn(bookingService, "updateBooking").mockResolvedValue({
  message: "Booking updated successfully.",
});

describe("BookingForm Component", () => {
  it("renders BookingForm page", async () => {
    const { getByText } = render(
      <BookingForm currentUser={{ id: "user123" }} bookingIdToUpdate="" />
    );

    expect(getByText("Make a Booking")).toBeInTheDocument();
  });

  it("renders BookingForm correctly and handles booking creation", async () => {
    bookingService.addBooking.mockResolvedValue({
      message: "Booking added successfully.",
    });

    const { getByLabelText, getByText } = render(
      <BookingForm currentUser={{ id: "user123" }} bookingIdToUpdate="" />
    );

    fireEvent.change(getByLabelText("Date:"), {
      target: { value: "2024-07-15" },
    });
    fireEvent.change(getByLabelText("Time:"), { target: { value: "14:00" } });
    fireEvent.change(getByLabelText("Number of People:"), {
      target: { value: "2" },
    });

    fireEvent.submit(getByText("Book Now"));

    await waitFor(() => {
      expect(getByText("Booking added successfully.")).toBeInTheDocument();
    });
  });
});
