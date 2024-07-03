import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "../src/components/Login";
import AuthService from "../src/services/auth.service";

vi.mock("../src/services/auth.service");

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    AuthService.login.mockClear();
    localStorage.clear();
  });

  it("renders Login component", () => {
    render(
      <MemoryRouter>
        <Login setCurrentUser={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockAccessToken = "mockAccessToken";
    const mockCurrentUser = { username: "testuser" };
    AuthService.login.mockResolvedValue({ accessToken: mockAccessToken });
    AuthService.getCurrentUser.mockReturnValue(mockCurrentUser);

    const setCurrentUser = vi.fn();

    render(
      <MemoryRouter>
        <Login setCurrentUser={setCurrentUser} />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/Password/i), "testpassword");
    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Wait for navigation to occur
    await screen.findByText(/Home Page/i);

    expect(AuthService.login).toHaveBeenCalledWith("testuser", "testpassword");
    expect(setCurrentUser).toHaveBeenCalledWith(mockCurrentUser);
    expect(localStorage.getItem("accessToken")).toBe(mockAccessToken);
  });

  it("handles login failure", async () => {
    const errorMessage = "Invalid credentials";
    AuthService.login.mockResolvedValue({ error: errorMessage });

    render(
      <MemoryRouter>
        <Login setCurrentUser={() => {}} />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/Password/i), "testpassword");
    await userEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(AuthService.login).toHaveBeenCalledWith("testuser", "testpassword");
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("should show error message when login without credentials", async () => {
    render(
      <MemoryRouter>
        <Login setCurrentUser={vi.fn()} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter both username and password."
    );
  });
});
