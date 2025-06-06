import {
  getMostRecentNodeGroupForUser,
  MostRecentNodeGroupInfo,
} from "./getMostRecentNodeGroupForUser";
import { Participant } from "../types/process.types";

describe("getMostRecentNodeGroupForUser", () => {
  const participants: Participant[] = [
    {
      userId: "user1",
      participantName: "홍길동",
      participantEmail: "hong@test.com",
      participantPictureUrl: null,
      invitedAt: "2025-05-01T10:00:00",
      acceptedAt: "2025-05-01T10:05:00",
      courses: [
        {
          courseId: "course1",
          courseTitle: "코스1",
          courseSlug: "course-1",
          nodeGroupCount: "2",
          nodeGroups: [
            {
              nodeGroupId: "ng1",
              nodeGroupTitle: "노드그룹1",
              order: 1,
              progress: {
                state: "DONE",
                lastSeenAt: "2025-06-01T12:00:00",
              },
            },
            {
              nodeGroupId: "ng2",
              nodeGroupTitle: "노드그룹2",
              order: 2,
              progress: {
                state: "IN_PROGRESS",
                lastSeenAt: "2025-06-03T15:00:00",
              },
            },
          ],
        },
        {
          courseId: "course2",
          courseTitle: "코스2",
          courseSlug: "course-2",
          nodeGroupCount: "1",
          nodeGroups: [
            {
              nodeGroupId: "ng3",
              nodeGroupTitle: "노드그룹3",
              order: 1,
              progress: {
                state: "IN_PROGRESS",
                lastSeenAt: "2025-06-05T09:30:00",
              },
            },
          ],
        },
      ],
    },
    {
      userId: "user2",
      participantName: "김철수",
      participantEmail: "kim@test.com",
      participantPictureUrl: null,
      invitedAt: "2025-05-02T11:00:00",
      acceptedAt: "2025-05-02T11:05:00",
      courses: [],
    },
  ];

  it("가장 최근에 본 node group 정보를 반환한다", () => {
    const result = getMostRecentNodeGroupForUser("user1", participants);
    expect(result).toEqual({
      courseId: "course2",
      courseTitle: "코스2",
      courseSlug: "course-2",
      nodeGroupId: "ng3",
      nodeGroupTitle: "노드그룹3",
      lastSeenAt: "2025-06-05T09:30:00",
    });
  });

  it("node group 기록이 없으면 null을 반환한다", () => {
    const result = getMostRecentNodeGroupForUser("user2", participants);
    expect(result).toBeNull();
  });

  it("존재하지 않는 userId는 null을 반환한다", () => {
    const result = getMostRecentNodeGroupForUser("user3", participants);
    expect(result).toBeNull();
  });
});
