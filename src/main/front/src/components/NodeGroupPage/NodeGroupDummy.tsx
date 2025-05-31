export const nodeGroupDummy = {
  nodeGroupName: "리눅스 설치하기",
  nodes: [
    {
      type: "text",
      nodeId: "node-001",
      commentsEnabled: true,
      comments: [
        {
          content: "내용이 명확해서 이해가 쉬웠어요.",
          category: "피드백",
          author: {
            name: "김지원",
            uid: "user-1001",
            studentId: "20230123",
          },
          timestamp: "2025-05-30T10:15:00Z",
        },
      ],
      content:
        "# 인공지능이란?\n인공지능(AI)은 인간의 지능을 모방하는 기술입니다. 머신러닝과 딥러닝이 이에 속합니다.",
    },
    {
      type: "image",
      nodeId: "node-002",
      commentsEnabled: false,
      comments: [],
      imageUrl: "https://cdn.example.com/images/ai-diagram.png",
    },
    {
      type: "video",
      nodeId: "node-003",
      commentsEnabled: true,
      comments: [
        {
          content: "영상 음량이 좀 작아요!",
          category: "피드백",
          author: {
            name: "이정훈",
            uid: "user-1002",
            studentId: "20231234",
          },
          timestamp: "2025-05-30T12:00:00Z",
        },
      ],
      videoUrl: "https://cdn.example.com/videos/intro-to-ai/playlist.mpd",
    },
    {
      type: "doc",
      nodeId: "node-004",
      commentsEnabled: false,
      comments: [],
      fileUrl: "https://cdn.example.com/files/ai-notes.pdf",
      fileName: "ai-notes.pdf",
    },
    {
      type: "quiz",
      nodeId: "node-005",
      commentsEnabled: true,
      comments: [],
      quiz: {
        title: "AI 기초 개념 퀴즈",
        questions: [
          {
            questionId: "q1",
            questionText: "인공지능의 하위 분야가 아닌 것은?",
            options: ["머신러닝", "딥러닝", "데이터베이스", "자연어처리"],
            correctAnswer: "데이터베이스",
          },
          {
            questionId: "q2",
            questionText: "딥러닝에서 사용하는 기본 단위는?",
            options: ["퍼셉트론", "트랜지스터", "클러스터", "토큰"],
            correctAnswer: "퍼셉트론",
          },
        ],
      },
    },
  ],
};
