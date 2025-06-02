export interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  pictureUrl: string;
  isVisible: number;
  creatorUserId: string;
  sections: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    nodeGroups: Array<{
      id: string;
      title: string;
      order: number;
      nodes: Array<{
        id: string;
        title: string;
        order: number;
      }> | null;
    }>;
  }>;
}
