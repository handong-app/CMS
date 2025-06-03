export type ProgressState = "DONE" | "IN_PROGRESS" | "NOT_STARTED" | null;

export type NodeGroupProgress = {
  total: number;
  completed: number;
  map: Record<string, ProgressState>; // nodeGroupId -> 상태
  lastSeenAt?: string | null;
};

export type UserProgress = {
  userId: string;
  programProgress: NodeGroupProgress;
  courseProgress: Record<string, NodeGroupProgress>;
};

// 필요한 경우 programData 타입도 정의
export type ProgramData = {
  programId: string;
  programName: string;
  programSlug: string;
  programDescription: string;
  participants: Participant[];
};

export type Participant = {
  userId: string;
  participantName: string;
  participantEmail: string;
  participantPictureUrl: string | null;
  invitedAt: string;
  acceptedAt: string;
  courses: Course[];
};

export type Course = {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  nodeGroupCount: string;
  nodeGroups: NodeGroup[];
};

export type NodeGroup = {
  nodeGroupId: string;
  nodeGroupTitle: string;
  order: number;
  progress: {
    state: ProgressState;
    lastSeenAt: string;
  } | null;
};
