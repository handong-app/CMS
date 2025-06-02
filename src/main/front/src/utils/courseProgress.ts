// 코스 이수율(학습률) 계산 유틸리티
// 입력: course 객체, 완료된 nodeGroup id의 Set

import { CourseData } from "../types/courseData.types";

export function calculateCourseProgress(
  course: CourseData,
  completedNodeIds: Set<string>
): number {
  if (!course || !Array.isArray(course.sections)) return 0;
  let total = 0;
  let completed = 0;
  course.sections.forEach((section) => {
    if (!Array.isArray(section.nodeGroups)) return;
    section.nodeGroups.forEach((nodeGroup) => {
      total += 1;
      if (completedNodeIds.has(nodeGroup.id)) {
        completed += 1;
      }
    });
  });
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
