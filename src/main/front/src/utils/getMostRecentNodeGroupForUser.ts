import { Participant } from "../types/process.types";

export interface MostRecentNodeGroupInfo {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  nodeGroupId: string;
  nodeGroupTitle: string;
  lastSeenAt: string;
}

/**
 * 주어진 userId와 participants 데이터에서 해당 사용자의 가장 최근에 본 node group 정보를 반환합니다.
 * @param userId string
 * @param participants Participant[]
 * @returns MostRecentNodeGroupInfo | null
 */
export function getMostRecentNodeGroupForUser(
  userId: string,
  participants: Participant[] | null
): MostRecentNodeGroupInfo | null {
  if (!participants) return null;
  console.log({ userId, participants });

  const participant = participants.find((p) => p.userId === userId);
  if (!participant) return null;

  let mostRecent: MostRecentNodeGroupInfo | null = null;

  participant.courses.forEach((course) => {
    course.nodeGroups.forEach((group) => {
      const lastSeenAt = group.progress?.lastSeenAt;
      if (lastSeenAt) {
        if (
          !mostRecent ||
          new Date(lastSeenAt) > new Date(mostRecent.lastSeenAt)
        ) {
          mostRecent = {
            courseId: course.courseId,
            courseTitle: course.courseTitle,
            courseSlug: course.courseSlug,
            nodeGroupId: group.nodeGroupId,
            nodeGroupTitle: group.nodeGroupTitle,
            lastSeenAt,
          };
        }
      }
    });
  });

  return mostRecent;
}
