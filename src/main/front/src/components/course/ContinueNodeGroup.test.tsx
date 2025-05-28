import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ContinueNodeGroup from "./ContinueNodeGroup";

describe("ContinueNodeGroup", () => {
  const defaultProps = {
    theme: "dark" as const,
    courseName: "React Basics",
    lessonName: "Hooks and State",
    onContinue: vi.fn(),
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    lastViewedAt: "2025-05-28 22:10",
  };

  it("renders course name", () => {
    render(<ContinueNodeGroup {...defaultProps} />);
    expect(screen.getByText(defaultProps.courseName)).toBeInTheDocument();
  });

  it("renders lesson name", () => {
    render(<ContinueNodeGroup {...defaultProps} />);
    expect(screen.getByText(defaultProps.lessonName)).toBeInTheDocument();
  });

  it("renders thumbnail image if provided", () => {
    render(<ContinueNodeGroup {...defaultProps} />);
    const img = screen.getByAltText("course thumbnail");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", defaultProps.thumbnail);
  });

  it("renders last viewed date if provided", () => {
    render(<ContinueNodeGroup {...defaultProps} />);
    expect(screen.getByText(/Last viewed:/)).toBeInTheDocument();
  });

  it("calls onContinue when clicked", () => {
    const onContinue = vi.fn();
    render(<ContinueNodeGroup {...defaultProps} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onContinue).toHaveBeenCalled();
  });

  it("shows 'Continue' button text", () => {
    render(<ContinueNodeGroup {...defaultProps} />);
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("renders correctly in light theme", () => {
    render(<ContinueNodeGroup {...defaultProps} theme="light" />);
    expect(screen.getByText(defaultProps.courseName)).toBeInTheDocument();
  });

  it("does not render image if thumbnail is not provided", () => {
    const { queryByAltText } = render(
      <ContinueNodeGroup {...defaultProps} thumbnail={undefined} />
    );
    expect(queryByAltText("course thumbnail")).not.toBeInTheDocument();
  });

  it("does not render last viewed date if not provided", () => {
    const { queryByText } = render(
      <ContinueNodeGroup {...defaultProps} lastViewedAt={undefined} />
    );
    expect(queryByText(/Last viewed:/)).not.toBeInTheDocument();
  });
});
