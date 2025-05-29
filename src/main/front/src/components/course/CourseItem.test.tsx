import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseItem from "./CourseItem";

describe("CourseItem", () => {
  const course = {
    name: "React Basics",
    picture: "https://example.com/course.jpg",
    progress: 70,
  };

  it("renders course picture", () => {
    render(
      <CourseItem
        name={course.name}
        picture={course.picture}
        progress={course.progress}
      />
    );
    const img = screen.getByAltText(`${course.name} 코스 이미지`);
    expect(document.body.contains(img)).to.be.true;
    expect(img.getAttribute("src")).to.equal(course.picture);
  });

  it("renders course name", () => {
    render(
      <CourseItem
        name={course.name}
        picture={course.picture}
        progress={course.progress}
      />
    );
    expect(screen.getByText(course.name)).to.exist;
  });

  it("renders course progress bar with correct value", () => {
    render(
      <CourseItem
        name={course.name}
        picture={course.picture}
        progress={course.progress}
      />
    );
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute(
      "aria-valuenow",
      course.progress.toString()
    );
  });
});
