import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import MyAppBar from "./MyAppBar";
import { MemoryRouter, Route, Routes } from "react-router";

// 이미지 모킹
vi.mock("../../assets/Logo.png", () => ({
  default: "mock-logo.png",
}));

describe("MyAppBar Component", () => {
  it("renders Login button when user is null", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MyAppBar user={{}} />} />
        </Routes>
      </MemoryRouter>
    );
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders welcome message and avatar when user is authenticated", () => {
    const user = {
      name: "Alice",
      profileImage: "https://example.com/avatar.png",
    } as any;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MyAppBar user={user} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Alice님 환영합니다!/)).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: "Alice" });
    expect(avatar).toBeInTheDocument();

    const loginButton = screen.queryByRole("button", { name: /login/i });
    expect(loginButton).not.toBeInTheDocument();
  });
});
