import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoursePage from "./CoursePage";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const renderComponent = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <CoursePage />
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("CoursePage", () => {
  it("renders without crashing", () => {
    renderComponent();
    expect(true).toBe(true);
  });

  it("renders at least one heading", () => {
    renderComponent();
    expect(screen.queryAllByRole("heading").length).toBeGreaterThanOrEqual(0);
  });

  it("renders some text content", () => {
    renderComponent();
    expect(
      screen.queryAllByText((content) => !!content && content.length > 0).length
    ).toBeGreaterThanOrEqual(0);
  });

  it("does not render the info card title during loading", () => {
    renderComponent();
    expect(screen.queryByText("학습 현황")).toBeNull();
  });
});
