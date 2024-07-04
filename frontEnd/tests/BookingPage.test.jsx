import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import BookingPage from "../src/components/BookingPage.jsx";
import BookingForm from "../src/components/BookingForm.jsx";
import authService from "../src/services/auth.service.js";
import { useParams } from "react-router-dom";

// Mock dependencies
vi.mock("../services/auth.service", () => ({
  getCurrentUser: vi.fn().mockReturnValue({ id: "user123", name: "Test User" }),
}));

vi.mock("react-router-dom", () => ({
  useParams: vi.fn().mockReturnValue({ bookingId: "booking123" }),
}));

vi.mock("./BookingForm", () => (props) => (
  <div data-testid="mockBookingForm">
    Mock Booking Form - currentUser: {JSON.stringify(props.currentUser)},
    bookingIdToUpdate: {props.bookingIdToUpdate}
  </div>
));

describe("BookingPage", () => {
  it("passes the correct props to BookingForm", () => {
    render(<BookingPage />);

    const bookingForm = screen.getByTestId("mockBookingForm");
    expect(bookingForm).toHaveTextContent(
      'currentUser: {"id":"user123","name":"Test User"}'
    );
    expect(bookingForm).toHaveTextContent("bookingIdToUpdate: booking123");
  });
});
