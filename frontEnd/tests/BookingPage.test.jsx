import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookingPage from "../src/components/BookingPage.jsx";
import authService from "../src/services/auth.service.js";

describe("BookingPage Component", () => {
  it("renders BookingForm with 'Make a Booking' text", () => {
    vi.spyOn(authService, "getCurrentUser").mockReturnValue({
      id: "user123",
      name: "Test User",
    });

    const bookingId = "booking123";

    const { getByText } = render(
      <MemoryRouter initialEntries={[`/booking/${bookingId}`]}>
        <Routes>
          <Route path="/booking/:bookingId" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText("Make a Booking")).toBeInTheDocument();
  });
});
