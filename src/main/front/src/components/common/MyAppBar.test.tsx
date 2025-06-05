import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import MyAppBar from "./MyAppBar";

// 이미지 모킹
vi.mock("../../assets/Logo.png", () => ({
  default: "mock-logo.png"
}));

describe("MyAppBar Component", () => {

  it.skip("renders Login button when user is null", () => {
    render(<MyAppBar user={null} />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it.skip("renders welcome message and avatar when user is authenticated", () => {
    const user = {
      name: "Alice",
      photoURL: "https://example.com/avatar.png"
    } as any;

    render(<MyAppBar user={user} />);

    expect(screen.getByText(/Alice님 환영합니다!/)).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: "Alice" });
    expect(avatar).toBeInTheDocument();

    const loginButton = screen.queryByRole("button", { name: /login/i });
    expect(loginButton).not.toBeInTheDocument();
  });
});
