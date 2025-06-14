export interface CourseNodeFile {
  path?: string;
  fileKey?: string;
  originalFileName?: string;
  status?: string;
  contentType?: string;
}

export type CourseNodeType = "VIDEO" | "IMAGE" | "QUIZ" | "FILE" | "TEXT";

export interface CourseNodeData {
  // VIDEO, IMAGE, FILE, TEXT
  title?: string;
  description?: string;
  file?: CourseNodeFile;
  // QUIZ
  question?: string;
  options?: string[];
  answer?: string;
  // TEXT
  content?: string;
}

export interface CourseNode {
  id: string;
  type: CourseNodeType;
  data: CourseNodeData;
  order: number;
  isCommentPermitted?: boolean;
}

export interface CourseNodeGroup {
  id: string;
  title: string;
  order: number;
  nodes: CourseNode[] | null;
  // 진도 상태 표시용(프론트 계산 결과)
  isCompleted?: boolean;
  isInProgress?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  order: number;
  nodeGroups: CourseNodeGroup[];
}

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  pictureUrl: string;
  isVisible: number;
  creatorUserId: string;
  creatorName: string;
  sections: CourseSection[];
}
