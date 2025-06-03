import { UserProgress } from "../types/process.types";

export const courseListParser = (
  programInfo: any,
  myProgress: UserProgress | undefined
) =>
  programInfo?.map((course: any) => ({
    ...course,
    progress: Math.round(
      ((myProgress?.courseProgress[course.id]?.completed || 0) /
        (myProgress?.courseProgress[course.id]?.total || 1)) *
        100
    ),
  })) || [];
