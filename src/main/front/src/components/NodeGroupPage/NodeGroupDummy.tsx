export interface NodeGroup {
  id: string;
  sectionId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  comments: Comment[];
}

export interface Node {
  id: string;
  nodeGroupId: string;
  type: NodeType;
  commentPermitted: boolean;
  data: NodeData;
  order: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export type NodeType = "VIDEO" | "QUIZ" | "IMAGE" | "FILE";

export type NodeData = VideoData | QuizData | ImageData | FileData;

export interface VideoData {
  title: string;
  description: string;
  file: FileMeta;
}

export interface ImageData {
  title: string;
  description: string;
  file: FileMetaWithUrl;
}

export interface FileData {
  title: string;
  description: string;
  file: FileMetaWithUrl;
}

export interface QuizData {
  question: string;
  options: string[];
  answer: string;
}

export interface FileMeta {
  path: string;
  originalFileName: string;
  status: string;
  contentType: string;
}

export interface FileMetaWithUrl extends Omit<FileMeta, "path"> {
  presignedUrl: string;
}

export interface Comment {
  // 댓글 기능이 확장되면 여기에 필드 추가
  category: string;
}

export const nodeGroupDummy = {
  id: "088c56343a6f4d14b9920e7964c8869f",
  sectionId: "1bb00bf5ad004671bad18ca93d712031",
  title: "Callein Node Group1",
  order: 1,
  createdAt: "2025-05-31 17:11:45.243382",
  updatedAt: "2025-05-31 17:11:45.243382",
  nodes: [
    {
      id: "051fa42f90e5426187b960eabfab1966",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "VIDEO",
      commentPermitted: true,
      data: {
        title: "유정섭이 손수 편집한 Cap mv",
        description: "유정섭 TV 화이팅",
        file: {
          originalFileName: "cap-mv.mp4",
          status: "TRANSCODE_COMPLETED",
          contentType: "video/mp4",
          playlist:
            "/api/v1/stream/051fa42f90e5426187b960eabfab1966/master.m3u8",
        },
      },
      order: 7,
      createdAt: "2025-06-03 00:15:05.734632",
      updatedAt: "2025-06-03 00:53:05.623072",
      comments: [],
    },
    {
      id: "1d69af51a2c84e1d86f015b33fbca106",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "VIDEO",
      commentPermitted: true,
      data: {
        title: "어느 한적한 시골 길위로 유정섭이 걸어다닙니다.",
        description: "유정섭 화이팅",
        file: {
          originalFileName: "country.mp4",
          status: "TRANSCODE_COMPLETED",
          contentType: "video/mp4",
          playlist:
            "/api/v1/stream/1d69af51a2c84e1d86f015b33fbca106/master.m3u8",
        },
      },
      order: 7,
      createdAt: "2025-06-02 15:04:01.483761",
      updatedAt: "2025-06-02 15:22:43.598883",
      comments: [],
    },
    {
      id: "3e72724ce99343b7a403fdc27fadfb3d",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "QUIZ",
      commentPermitted: true,
      data: {
        question: "Who is Junglesub?",
        options: ["A: KING", "B: GOD"],
        answer: "A&B",
      },
      order: 5,
      createdAt: "2025-06-01 16:52:08.855513",
      updatedAt: "2025-06-01 16:52:08.855513",
      comments: [],
    },
    {
      id: "5ee66300df3f4f48bb2725b4cca1c9eb",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "IMAGE",
      commentPermitted: true,
      data: {
        title: "2Callein node image",
        description: "2Callein node image node",
        file: {
          originalFileName: "pine_cone.jpeg",
          status: "UPLOADED",
          contentType: "image/jpeg",
          presignedUrl:
            "https://s3.handong.app/cms/node_file/image/5ee66300df3f4f48bb2725b4cca1c9eb.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250602T173720Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=mS70m69FOoV5p1VZFWtU%2F20250602%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=04bf128d916b4786d365451c7bab2fb80b8e5a59438ff61d40b8df9d9ad4390b",
        },
      },
      order: 2,
      createdAt: "2025-06-01 16:41:47.935076",
      updatedAt: "2025-06-01 17:27:04.787800",
      comments: [],
    },
    {
      id: "7bc1fa0259bb4c0f95168216fdc62360",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "VIDEO",
      commentPermitted: true,
      data: {
        title: "6Callein node video",
        description: "6Callein node video desc",
        file: {
          originalFileName: "",
          status: "PENDING",
          contentType: "",
        },
      },
      order: 6,
      createdAt: "2025-06-01 16:54:58.633514",
      updatedAt: "2025-06-01 16:54:58.633514",
      comments: [],
    },
    {
      id: "8854f42d11da4163bbd70c0def35514f",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "QUIZ",
      commentPermitted: true,
      data: {
        question: "What is an array?",
        options: ["A", "B"],
        answer: "A",
      },
      order: 4,
      createdAt: "2025-06-01 16:51:22.463676",
      updatedAt: "2025-06-01 16:51:22.463676",
      comments: [],
    },
    {
      id: "ab0ce4332af34989806d45f18a42d300",
      nodeGroupId: "088c56343a6f4d14b9920e7964c8869f",
      type: "FILE",
      commentPermitted: true,
      data: {
        title: "1Callein node file",
        description: "1Callein node file node",
        file: {
          originalFileName: "helpemeeee.txt",
          status: "UPLOADED",
          contentType: "text/plain",
          presignedUrl:
            "https://s3.handong.app/cms/node_file/file/ab0ce4332af34989806d45f18a42d300.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250602T173720Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Credential=mS70m69FOoV5p1VZFWtU%2F20250602%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f3d65ffa55b5564a59bcae2a0dda525356c9bae522d7fff1ba98dac82264da21",
        },
      },
      order: 1,
      createdAt: "2025-06-01 16:49:45.027641",
      updatedAt: "2025-06-01 18:07:27.970751",
      comments: [],
    },
  ],
  comments: [],
};

//   nodeGroupName: "머신러닝 개요",
//   nodes: [
//     {
//       nodeId: "node-text",
//       type: "text",
//       commentsEnabled: true,
//       comments: [
//         {
//           content: "좋은 설명 감사합니다!",
//           category: "감사",
//           author: {
//             name: "홍길동",
//             uid: "uid001",
//             studentId: "20230001",
//           },
//           timestamp: "2025-05-30T10:00:00Z",
//         },
//         {
//           content: "이 부분 다시 설명해주시면 좋겠어요.",
//           category: "질문",
//           author: {
//             name: "김지원",
//             uid: "user123",
//             studentId: "20230001",
//           },
//           timestamp: "2025-05-31T09:15:00Z",
//         },
//         {
//           content: "여기서 예시가 하나 더 있으면 좋을 것 같아요.",
//           category: "피드백",
//           author: {
//             name: "이수민",
//             uid: "uid002",
//             studentId: "20220012",
//           },
//           timestamp: "2025-05-30T10:15:23Z",
//         },
//       ],
//       content: {
//         markdown:
//           "## 머신러닝이란?\n\n머신러닝은 데이터를 기반으로 모델을 학습하여 예측하거나 분류하는 기술입니다.",
//       },
//     },
//     {
//       nodeId: "node-image",
//       type: "image",
//       commentsEnabled: true,
//       comments: [],
//       content: {
//         imageUrl: "https://example.com/images/machine_learning_diagram.png",
//       },
//     },
//     {
//       nodeId: "node-video",
//       type: "video",
//       commentsEnabled: true,
//       comments: [
//         {
//           content: "이 영상 덕분에 개념이 잘 이해됐어요!",
//           category: "칭찬",
//           author: {
//             name: "최지원",
//             uid: "uid003",
//             studentId: "20220145",
//           },
//           timestamp: "2025-05-30T11:05:00Z",
//         },
//         {
//           content: "이 부분 다시 설명해주시면 좋겠어요.",
//           category: "질문",
//           author: {
//             name: "김지원",
//             uid: "user123",
//             studentId: "20230001",
//           },
//           timestamp: "2025-05-31T09:15:00Z",
//         },
//       ],

//       content: {
//         videoUrl: "https://cdn.example.com/videos/ml_intro/stream.mpd", // DASH 스트리밍 예시
//       },
//     },
//     {
//       nodeId: "node-pdf",
//       type: "doc",
//       commentsEnabled: false,
//       comments: [],
//       content: {
//         fileUrl: "https://cdn.example.com/files/ml_summary.pdf",
//       },
//     },
//   ],
// };
