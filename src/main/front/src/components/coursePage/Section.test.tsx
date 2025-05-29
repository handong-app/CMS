import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Section from "./Section";

describe("Section", () => {
  const defaultProps = {
    text: "Section Title",
  };

  const renderComponent = (props = {}) =>
    render(<Section {...defaultProps} {...props} />);

  it("renders the section text", () => {
    renderComponent();
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });
});
