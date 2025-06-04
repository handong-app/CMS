export interface Node {
  id: string;
  type: "VIDEO" | "IMAGE" | "FILE" | "QUIZ" | "TEXT";
  data: any; // 구체적인 데이터 타입은 각 노드 타입에 따라 다름
  commentPermitted: boolean;
  order: number;
}
