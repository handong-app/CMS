import { render, screen } from "@testing-library/react";
import CourseItem from "./CourseItem";

describe("CourseItem", () => {
  it("renders course picture, name, and progress", () => {
    // Example props
    const course = {
      name: "React Basics",
      picture: "https://example.com/course.jpg",
      progress: 70,
    };
    render(
      <CourseItem
        name={course.name}
        picture={course.picture}
        progress={course.progress}
      />
    );
    // Image
    const img = screen.getByAltText(/course picture/i);
    // @testing-library/jest-dom matcher가 없으므로 기본 chai matcher 사용
    expect(document.body.contains(img)).to.be.true;
    expect(img.getAttribute("src")).to.equal(course.picture);
    // Name
    expect(screen.getByText(course.name)).to.exist;
    // Progress
    expect(screen.getByText(/70%/)).to.exist;
  });
});
