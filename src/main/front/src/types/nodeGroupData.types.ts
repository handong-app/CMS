export interface Comment {
  content: string;
  category: string;
  author: {
    name: string;
    uid: string;
    studentId: string;
  };
  timestamp: string;
}

export interface NodeFile {
  originalFileName: string;
  contentType: string;
  presignedUrl?: string;
  playlist?: string;
  status?: string;
  progress?: number;
}

export interface NodeData {
  title?: string;
  description?: string;
  file?: NodeFile;
  question?: string;
  options?: string[];
  answer?: string;
}

export interface Node {
  id: string;
  nodeGroupId: string;
  type: string;
  commentPermitted: boolean;
  data: NodeData;
  comments: Comment[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface NodeGroup {
  id: string;
  title: string;
  description?: string;
  nodes: Node[];
}
