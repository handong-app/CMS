import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import MyAppBar from "./MyAppBar";
import { UserInfo } from "../../store/authStore";

// 이미지 모킹 (이미지 import 시 에러 방지용)
vi.mock("../../assets/Logo.png", () => ({
  default: "mock-logo.png"
}));

describe("MyAppBar Component", () => {
  it("renders Login button when user is null", () => {
    render(
      <MemoryRouter>
        <MyAppBar user={null} />
      </MemoryRouter>
    );
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders welcome message and avatar when user is authenticated", () => {
    const user: UserInfo = {
      name: "Alice",
      email: "alice@example.com",
      photoURL: "https://example.com/avatar.png"
    };

    render(
      <MemoryRouter>
        <MyAppBar user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Alice님 환영합니다!/)).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: "Alice" });
    expect(avatar).toBeInTheDocument();

    const loginButton = screen.queryByRole("button", { name: /login/i });
    expect(loginButton).not.toBeInTheDocument();
  });
});
