import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseProgressList from "./CourseProgressList";

describe("CourseProgressList", () => {
  const defaultProps = {
    courseTitle: "Test Course",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        description: "Description for Section 1",
        order: 1,
        nodeGroups: [
          {
            id: "g1",
            title: "Group 1",
            isCompleted: true,
            order: 1,
            nodes: [],
          },
          {
            id: "g2",
            title: "Group 2",
            isCompleted: false,
            order: 2,
            nodes: [],
          },
        ],
      },
    ],
    width: 300,
  };

  const renderComponent = () =>
    render(<CourseProgressList {...defaultProps} />);

  it("renders the course title", () => {
    renderComponent();
    expect(screen.getByText("Test Course")).toBeInTheDocument();
  });

  it("renders section titles", () => {
    renderComponent();
    expect(screen.getByText("Section 1")).toBeInTheDocument();
  });

  it("renders group titles", () => {
    renderComponent();
    expect(screen.getByText("Group 1")).toBeInTheDocument();
  });

  it("renders completed group icon", () => {
    renderComponent();
    const completedIcon = screen.getAllByTestId("CheckCircleIcon");
    expect(completedIcon.length).toBeGreaterThan(0);
  });

  it("renders incomplete group icon", () => {
    renderComponent();
    const incompleteIcon = screen.getAllByTestId("RadioButtonUncheckedIcon");
    expect(incompleteIcon.length).toBeGreaterThan(0);
  });
});
