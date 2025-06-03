import { describe, it, expect } from "vitest";
import { ProgramData } from "../types/process.types";
import calculateProgress from "./calculateProcess";

const mockData: ProgramData = {
  programId: "prog001",
  programName: "Test Program",
  programSlug: "test-program",
  programDescription: "Test Desc",
  participants: [
    {
      userId: "user1",
      participantName: "Test User",
      participantEmail: "test@example.com",
      participantPictureUrl: null,
      invitedAt: "2025-01-01 00:00:00",
      acceptedAt: "2025-01-02 00:00:00",
      courses: [
        {
          courseId: "course1",
          courseTitle: "Course 1",
          courseSlug: "course-1",
          nodeGroupCount: "2",
          nodeGroups: [
            {
              nodeGroupId: "ng1",
              nodeGroupTitle: "NodeGroup 1",
              order: 1,
              progress: {
                state: "DONE",
                lastSeenAt: "2025-05-31 17:15:14",
              },
            },
            {
              nodeGroupId: "ng2",
              nodeGroupTitle: "NodeGroup 2",
              order: 2,
              progress: {
                state: "IN_PROGRESS",
                lastSeenAt: "2025-05-31 17:15:14",
              },
            },
          ],
        },
        {
          courseId: "course2",
          courseTitle: "Course 2",
          courseSlug: "course-2",
          nodeGroupCount: "1",
          nodeGroups: [
            {
              nodeGroupId: "ng3",
              nodeGroupTitle: "NodeGroup 3",
              order: 1,
              progress: null,
            },
          ],
        },
      ],
    },
  ],
};

describe("calculateProgress", () => {
  it("should calculate program and course progress correctly", () => {
    const result = calculateProgress(mockData);

    expect(result.length).toBe(1);

    const userProgress = result[0];
    expect(userProgress.userId).toBe("user1");

    // Program-level: 3 total (2 DONE/IN_PROGRESS, 1 null)
    expect(userProgress.programProgress.total).toBe(3);
    expect(userProgress.programProgress.completed).toBe(1);
    expect(userProgress.programProgress.map).toEqual({
      ng1: "DONE",
      ng2: "IN_PROGRESS",
      ng3: null,
    });

    // Course-level
    expect(userProgress.courseProgress["course1"]).toEqual({
      total: 2,
      completed: 1,
      lastSeenAt: "2025-05-31 17:15:14",
      map: {
        ng1: "DONE",
        ng2: "IN_PROGRESS",
      },
    });

    expect(userProgress.courseProgress["course2"]).toEqual({
      total: 1,
      completed: 0,
      lastSeenAt: null,
      map: {
        ng3: null,
      },
    });
  });
});
