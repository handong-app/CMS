import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SectionCourses from "./SectionCourses";

describe("SectionCourses", () => {
  const defaultProps = {
    title: "SectionCourses Title",
    description: "SectionCourses Description",
    nodes: [
      { id: "n1", type: "video" as const, title: "Video Node" },
      { id: "n2", type: "doc" as const, title: "Doc Node" },
      { id: "n3", type: "quiz" as const, title: "Quiz Node" },
      { id: "n4", type: "image" as const, title: "Image Node" },
    ],
  };

  const renderComponent = (props = {}) =>
    render(<SectionCourses {...defaultProps} {...props} />);

  it("renders the section title", () => {
    renderComponent();
    expect(screen.getByText("SectionCourses Title")).toBeInTheDocument();
  });

  it("renders the section description", () => {
    renderComponent();
    expect(screen.getByText("SectionCourses Description")).toBeInTheDocument();
  });

  it("renders all node titles", () => {
    renderComponent();
    expect(screen.getByText("Video Node")).toBeInTheDocument();
    // Only one expect per test, so split into multiple tests
  });

  it("renders doc node title", () => {
    renderComponent();
    expect(screen.getByText("Doc Node")).toBeInTheDocument();
  });

  it("renders quiz node title", () => {
    renderComponent();
    expect(screen.getByText("Quiz Node")).toBeInTheDocument();
  });

  it("renders image node title", () => {
    renderComponent();
    expect(screen.getByText("Image Node")).toBeInTheDocument();
  });
});
