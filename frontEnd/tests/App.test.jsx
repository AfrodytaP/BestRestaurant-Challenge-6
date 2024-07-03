import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

describe("App Tests", () => {
  it("renders the Header, Home page and Footer", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByAltText("BestRestaurant logo")).toBeInTheDocument();
    expect(screen.getByText("Tell me about...")).toBeInTheDocument();
    expect(screen.getByText("© 2024 BestRestaurant")).toBeInTheDocument();
  });
});
