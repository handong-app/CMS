import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import MyAppBar from "./MyAppBar";

vi.mock("../../assets/Logo.png", () => ({
  default: "mock-logo.png"
}));

describe("MyAppBar Component", () => {
  it("renders Login button when user is null", () => {
    render(<MyAppBar user={null} />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders welcome message and avatar when user is authenticated", () => {
    const user = {
      name: "Alice",
      photoURL: "https://example.com/avatar.png"
    };

    render(<MyAppBar user={user} />);

    expect(screen.getByText(/Alice님 환영합니다!/)).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: "Alice" });
    expect(avatar).toBeInTheDocument();

    const loginButton = screen.queryByRole("button", { name: /login/i });
    expect(loginButton).not.toBeInTheDocument();
  });
});
