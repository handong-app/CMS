import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TopCourseBanner from "./TopCourseBanner";

describe("TopCourseBanner", () => {
  const defaultProps = {
    title: "Test Course Title",
    producer: "Test Producer",
    image: "https://example.com/banner.jpg",
    altText: "Test Banner Alt",
    courseDiscription: "Test course description.",
    onContinue: vi.fn(),
  };

  const renderComponent = (props = {}) =>
    render(<TopCourseBanner {...defaultProps} {...props} />);

  it("renders the course title", () => {
    renderComponent();
    expect(screen.getByText("Test Course Title")).toBeInTheDocument();
  });

  it("renders the producer", () => {
    renderComponent();
    expect(screen.getByText("Test Producer")).toBeInTheDocument();
  });

  it("renders the course description", () => {
    renderComponent();
    expect(screen.getByText("Test course description.")).toBeInTheDocument();
  });

  it("renders the image with correct alt", () => {
    renderComponent();
    const img = screen.getByAltText("Test Banner Alt");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/banner.jpg");
  });

  it("calls onContinue when button is clicked", () => {
    const onContinue = vi.fn();
    renderComponent({ onContinue });
    const button = screen.getByText("Continue Learning");
    fireEvent.click(button);
    expect(onContinue).toHaveBeenCalled();
  });
});
