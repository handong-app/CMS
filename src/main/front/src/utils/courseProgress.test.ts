import { describe, it, expect } from "vitest";
import { calculateCourseProgress } from "./courseProgress";
import { CourseData } from "../types/courseData.types";

const dummyCourse: CourseData = {
  id: "course1",
  title: "Test Course",
  slug: "test-course",
  description: "A dummy course for testing",
  pictureUrl: "",
  isVisible: 1,
  creatorUserId: "user1",
  creatorName: "Test Creator",
  sections: [
    {
      id: "section1",
      title: "Section 1",
      description: "",
      order: 1,
      nodeGroups: [
        { id: "ng1", title: "NodeGroup 1", order: 1, nodes: null },
        { id: "ng2", title: "NodeGroup 2", order: 2, nodes: null },
      ],
    },
    {
      id: "section2",
      title: "Section 2",
      description: "",
      order: 2,
      nodeGroups: [{ id: "ng3", title: "NodeGroup 3", order: 1, nodes: null }],
    },
  ],
};

describe("calculateCourseProgress", () => {
  it("returns 0 if no nodeGroups are completed", () => {
    const completed = new Set<string>();
    const progress = calculateCourseProgress(dummyCourse, completed);
    expect(progress).toBe(0);
  });

  it("returns correct percentage for some completed nodeGroups", () => {
    const completed = new Set<string>(["ng1", "ng3"]);
    const progress = calculateCourseProgress(dummyCourse, completed);
    expect(progress).toBe(67); // 2/3 nodeGroups
  });

  it("returns 100 if all nodeGroups are completed", () => {
    const completed = new Set<string>(["ng1", "ng2", "ng3"]);
    const progress = calculateCourseProgress(dummyCourse, completed);
    expect(progress).toBe(100);
  });

  it("returns 0 if course has no sections", () => {
    const emptyCourse = { ...dummyCourse, sections: [] };
    const completed = new Set<string>();
    const progress = calculateCourseProgress(emptyCourse, completed);
    expect(progress).toBe(0);
  });
});
