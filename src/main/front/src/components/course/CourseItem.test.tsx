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
    const img = screen.getByAltText(/course picture/i);
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

  it.skip("renders course progress", () => {
    render(
      <CourseItem
        name={course.name}
        picture={course.picture}
        progress={course.progress}
      />
    );
    expect(screen.getByText(/70%/)).to.exist;
  });
});
