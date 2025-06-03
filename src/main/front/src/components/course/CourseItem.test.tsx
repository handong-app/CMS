import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseItem from "./CourseItem";
import { MemoryRouter } from "react-router";

describe("CourseItem", () => {
  const course = {
    name: "React Basics",
    picture: "https://example.com/course.jpg",
    progress: 70,
  };

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <CourseItem
          name={course.name}
          picture={course.picture}
          progress={course.progress}
          url="https://example.com/course"
        />
      </MemoryRouter>
    );

  it("renders course picture", () => {
    renderComponent();
    const img = screen.getByAltText(`${course.name} 코스 이미지`);
    expect(document.body.contains(img)).to.be.true;
    expect(img.getAttribute("src")).to.equal(course.picture);
  });

  it("renders course name", () => {
    renderComponent();
    expect(screen.getByText(course.name)).to.exist;
  });

  it("renders course progress bar with correct value", () => {
    renderComponent();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute(
      "aria-valuenow",
      course.progress.toString()
    );
  });
});
