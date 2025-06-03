import {
  NodeGroupProgress,
  ProgramData,
  ProgressState,
  UserProgress,
} from "../types/process.types";

function getLastSeenAtFromNodeGroups(nodeGroups: any[]): string | null {
  // nodeGroups: NodeGroup[]
  let lastSeen: string | null = null;
  nodeGroups.forEach((group) => {
    const seen = group.progress?.lastSeenAt;
    if (seen) {
      if (!lastSeen || new Date(seen) > new Date(lastSeen)) {
        lastSeen = seen;
      }
    }
  });
  return lastSeen;
}

function calculateProgress(data: ProgramData): UserProgress[] {
  return data.participants.map((participant) => {
    const nodeGroupStatusMap: Record<string, ProgressState> = {};
    let totalNodeGroups = 0;
    let completedNodeGroups = 0;

    const courseProgress: Record<string, NodeGroupProgress> = {};
    let programLastSeenAt: string | null = null;

    participant.courses.forEach((course) => {
      let courseTotal = 0;
      let courseCompleted = 0;
      const nodeGroupMap: Record<string, ProgressState> = {};

      // 각 코스의 마지막 학습 시간 계산
      const courseLastSeenAt = getLastSeenAtFromNodeGroups(course.nodeGroups);
      if (courseLastSeenAt) {
        if (
          !programLastSeenAt ||
          new Date(courseLastSeenAt) > new Date(programLastSeenAt)
        ) {
          programLastSeenAt = courseLastSeenAt;
        }
      }

      course.nodeGroups.forEach((group) => {
        const status = group.progress?.state ?? null;
        courseTotal++;
        totalNodeGroups++;

        if (status === "DONE") {
          courseCompleted++;
          completedNodeGroups++;
        }

        nodeGroupMap[group.nodeGroupId] = status;
        nodeGroupStatusMap[group.nodeGroupId] = status;
      });

      courseProgress[course.courseId] = {
        total: courseTotal,
        completed: courseCompleted,
        map: nodeGroupMap,
        lastSeenAt: courseLastSeenAt ?? null,
      };
    });

    return {
      userId: participant.userId,
      programProgress: {
        total: totalNodeGroups,
        completed: completedNodeGroups,
        map: nodeGroupStatusMap,
        lastSeenAt: programLastSeenAt,
      },
      courseProgress,
    };
  });
}

export default calculateProgress;
