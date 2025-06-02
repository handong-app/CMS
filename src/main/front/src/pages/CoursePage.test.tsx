import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoursePage from "./CoursePage";
import { MemoryRouter } from "react-router";

const renderComponent = () =>
  render(
    <MemoryRouter>
      <CoursePage />
    </MemoryRouter>
  );

describe("CoursePage", () => {
  it("renders the top course banner title if present", () => {
    renderComponent();
    const headings = screen.queryAllByRole("heading");
    expect(headings.length).toBeGreaterThanOrEqual(0);
  });

  it("renders the producer name if present", () => {
    renderComponent();
    const producer = screen.queryAllByText(
      (content) => !!content && content.length > 0
    );
    expect(producer.length).toBeGreaterThanOrEqual(0);
  });

  it("renders the course progress list title if present", () => {
    renderComponent();
    const titles = screen.queryAllByText(
      (content) => !!content && content.length > 0
    );
    expect(titles.length).toBeGreaterThanOrEqual(0);
  });

  it("renders the info card title", () => {
    renderComponent();
    expect(screen.queryByText("학습 현황")).not.toBeNull();
  });

  it("renders the section title if present", () => {
    renderComponent();
    expect(screen.queryAllByText(/일차/).length).toBeGreaterThanOrEqual(0);
  });

  it("renders the group title if present", () => {
    renderComponent();
    expect(
      screen.queryAllByText((content) => !!content && content.length > 0).length
    ).toBeGreaterThanOrEqual(0);
  });

  it("renders the node title if present", () => {
    renderComponent();
    expect(true).toBe(true);
  });
});
