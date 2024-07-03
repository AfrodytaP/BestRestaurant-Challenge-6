import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePassword from "../src/components/ChangePassword";
import AuthService from "../src/services/auth.service";
import ValidationServiceHelpers from "../src/services/validation.serviceHelpers";

vi.mock("../src/services/auth.service");
vi.mock("../src/services/validation.serviceHelpers");

vi.mock("../services/auth.service", () => ({
  changePassword: vi.fn(),
}));

vi.mock("../services/validation.serviceHelpers", () => ({
  required: vi.fn(),
  vpassword: vi.fn(),
}));

describe("ChangePassword Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders ChangePassword component", () => {
    render(<ChangePassword />);
    const heading = screen.getByRole("heading", { name: /Change Password/i });
    expect(heading).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    const user = userEvent.setup();
    const mockSuccessResponse = { message: "Password changed successfully" };
    AuthService.changePassword.mockResolvedValue(mockSuccessResponse);

    render(<ChangePassword />);

    await user.type(screen.getByLabelText(/Old Password/i), "oldPassword123");
    await user.type(screen.getByLabelText(/New Password/i), "newPassword123");
    await user.click(screen.getByRole("button", { name: /Change Password/i }));

    await screen.findByText(/Password changed successfully/i);

    expect(AuthService.changePassword).toHaveBeenCalledWith(
      "oldPassword123",
      "newPassword123"
    );
    expect(
      screen.getByText(/Password changed successfully/i)
    ).toBeInTheDocument();
  });

  it("handles service error", async () => {
    const user = userEvent.setup();
    const mockErrorResponse = { message: "An error occurred" };
    AuthService.changePassword.mockRejectedValue(mockErrorResponse);

    render(<ChangePassword />);

    await user.type(screen.getByLabelText(/Old Password/i), "oldPassword123");
    await user.type(screen.getByLabelText(/New Password/i), "newPassword123");
    await user.click(screen.getByRole("button", { name: /Change Password/i }));

    await screen.findByText(/An error occurred/i);

    expect(AuthService.changePassword).toHaveBeenCalledWith(
      "oldPassword123",
      "newPassword123"
    );
    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
  });

  it("displays error when incorrect details are entered", async () => {
    ValidationServiceHelpers.required.mockImplementation((value) =>
      value ? "" : "Required"
    );
    ValidationServiceHelpers.vpassword.mockImplementation(
      (value) => "Invalid password format"
    );

    render(<ChangePassword />);

    await userEvent.type(screen.getByLabelText(/Old Password/i), "oldpassword");
    await userEvent.type(screen.getByLabelText(/New Password/i), "new");

    await userEvent.click(
      screen.getByRole("button", { name: /Change Password/i })
    );

    expect(screen.getByText(/Invalid password format/i)).toBeInTheDocument();
  });
});
