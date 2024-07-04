// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import BookingForm from "../src/components/BookingForm.jsx";

// test("submits correct values", async () => {
//   const mockSubmit = vi.fn();

//   render(<BookingForm onSubmit={mockSubmit} />);

//   await userEvent.type(screen.getByLabelText(/date/i), "2023-04-30");
//   await userEvent.selectOptions(screen.getByLabelText(/time/i), "12:00");
//   await userEvent.selectOptions(
//     screen.getByLabelText(/number of people/i),
//     "3"
//   );

//   await userEvent.click(screen.getByRole("button", { name: /book now/i }));

//   expect(mockSubmit).toHaveBeenCalledWith({
//     date: "2023-04-30",
//     time: "12:00",
//     numberOfPeople: "3",
//   });

//   expect(mockSubmit).toHaveBeenCalledTimes(1);
// });
