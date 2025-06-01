export const nodeGroupDummy = {
  nodeGroupName: "머신러닝 개요",
  nodes: [
    {
      nodeId: "node-text",
      type: "text",
      commentsEnabled: true,
      comments: [
        {
          content: "좋은 설명 감사합니다!",
          category: "감사",
          author: {
            name: "홍길동",
            uid: "uid001",
            studentId: "20230001",
          },
          timestamp: "2025-05-30T10:00:00Z",
        },
        {
          content: "이 부분 다시 설명해주시면 좋겠어요.",
          category: "질문",
          author: {
            name: "김지원",
            uid: "user123",
            studentId: "20230001",
          },
          timestamp: "2025-05-31T09:15:00Z",
        },
        {
          content: "여기서 예시가 하나 더 있으면 좋을 것 같아요.",
          category: "피드백",
          author: {
            name: "이수민",
            uid: "uid002",
            studentId: "20220012",
          },
          timestamp: "2025-05-30T10:15:23Z",
        },
      ],
      content: {
        markdown:
          "## 머신러닝이란?\n\n머신러닝은 데이터를 기반으로 모델을 학습하여 예측하거나 분류하는 기술입니다.",
      },
    },
    {
      nodeId: "node-image",
      type: "image",
      commentsEnabled: true,
      comments: [],
      content: {
        imageUrl: "https://example.com/images/machine_learning_diagram.png",
      },
    },
    {
      nodeId: "node-video",
      type: "video",
      commentsEnabled: true,
      comments: [
        {
          content: "이 영상 덕분에 개념이 잘 이해됐어요!",
          category: "칭찬",
          author: {
            name: "최지원",
            uid: "uid003",
            studentId: "20220145",
          },
          timestamp: "2025-05-30T11:05:00Z",
        },
        {
          content: "이 부분 다시 설명해주시면 좋겠어요.",
          category: "질문",
          author: {
            name: "김지원",
            uid: "user123",
            studentId: "20230001",
          },
          timestamp: "2025-05-31T09:15:00Z",
        },
      ],

      content: {
        videoUrl: "https://cdn.example.com/videos/ml_intro/stream.mpd", // DASH 스트리밍 예시
      },
    },
    {
      nodeId: "node-pdf",
      type: "doc",
      commentsEnabled: false,
      comments: [],
      content: {
        fileUrl: "https://cdn.example.com/files/ml_summary.pdf",
      },
    },
  ],
};
