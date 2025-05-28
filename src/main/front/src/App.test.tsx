import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/vitest";
import App from "./App";

describe("App Component", () => {
  it("renders Vite and React logos", () => {
    render(<App />);

    const viteLogo = screen.getByAltText("Vite logo");
    const reactLogo = screen.getByAltText("React logo");

    expect(viteLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });

  it("displays the initial count", () => {
    render(<App />);

    const countElement = screen.getByText(/count is 0/i);
    expect(countElement).toBeInTheDocument();
  });

  it("increments count when button is clicked", async () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /count is 0/i });
    await userEvent.click(button);

    const updatedCountElement = await screen.findByText(/count is 1/i);
    expect(updatedCountElement).toBeInTheDocument();
  });
});
