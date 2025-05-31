import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it } from "vitest";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Routing Structure", () => {
  it("renders layout with AppBar and nested route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>Home Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // ✅ AppBar가 있는지 확인
    const appBar = screen.getByRole("banner");
    expect(appBar).toBeInTheDocument();

    // ✅ Outlet이 정상적으로 작동하는지 확인 (예: 홈 페이지 내용 보임)
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
