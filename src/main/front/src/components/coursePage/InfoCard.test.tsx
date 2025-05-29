import { render, screen } from "@testing-library/react";
import InfoCard from "./InfoCard";
import "@testing-library/jest-dom";

describe("InfoCard", () => {
  const defaultProps = {
    title: "Test Title",
    content: <div>Test Content</div>,
    width: 300,
    height: 200,
  };

  const renderComponent = (props = {}) =>
    render(<InfoCard {...defaultProps} {...props} />);

  it("renders the title", () => {
    renderComponent();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders the content", () => {
    renderComponent();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the width prop", () => {
    renderComponent({ width: 400 });
    const card = screen.getByText("Test Title").closest(".MuiPaper-root");
    expect(card).toHaveStyle({ width: "400px" });
  });

  it("applies the height prop", () => {
    renderComponent({ height: 150 });
    const card = screen.getByText("Test Title").closest(".MuiPaper-root");
    expect(card).toHaveStyle({ height: "150px" });
  });
});
