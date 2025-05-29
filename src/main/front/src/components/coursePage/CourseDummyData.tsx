export const courseDummyData = {
  courseTitle: "시스템 해킹과 보안",
  instructor: "20학번 이승현",
  sections: [
    {
      id: "section1",
      title: "1일차",
      nodeGroups: [
        {
          id: "g1",
          title: "리눅스 설치하기",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: true,
          nodes: [
            { id: "n1", type: "video" as const, title: "리눅스 세팅하기" },
            { id: "n2", type: "doc" as const, title: "설치 문서 PDF" },
            { id: "n3", type: "quiz" as const, title: "설치 퀴즈" },
          ],
        },
        {
          id: "g2",
          title: "기초 명령어 배우기",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: true,
          nodes: [
            { id: "n4", type: "doc" as const, title: "명령어 정리 자료" },
            { id: "n5", type: "video" as const, title: "명령어 영상 강의" },
          ],
        },
      ],
    },
    {
      id: "section2",
      title: "2일차",
      nodeGroups: [
        {
          id: "g3",
          title: "심화 실습",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: true,
          nodes: [
            { id: "n6", type: "image" as const, title: "실습 결과 스크린샷" },
            { id: "n7", type: "video" as const, title: "심화 과정 영상" },
          ],
        },
        {
          id: "g4",
          title: "리눅스 취약점 분석",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: false,
          nodes: [
            { id: "n8", type: "doc" as const, title: "취약점 분석 보고서" },
            { id: "n9", type: "quiz" as const, title: "취약점 퀴즈" },
          ],
        },
      ],
    },
    {
      id: "section3",
      title: "3일차",
      nodeGroups: [
        {
          id: "g5",
          title: "네트워크 해킹",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: false,
          nodes: [
            { id: "n10", type: "video" as const, title: "네트워크 패킷 분석" },
            { id: "n11", type: "doc" as const, title: "네트워크 개요 문서" },
          ],
        },
        {
          id: "g6",
          title: "방화벽 우회",
          description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
          isCompleted: false,
          nodes: [
            { id: "n12", type: "video" as const, title: "우회 전략 강의" },
            { id: "n13", type: "image" as const, title: "우회 다이어그램" },
          ],
        },
      ],
    },
    // {
    //   id: "section4",
    //   title: "4일차",
    //   nodeGroups: [
    //     {
    //       id: "g7",
    //       title: "네트워크 해킹",
    //       description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
    //       isCompleted: false,
    //       nodes: [
    //         { id: "n14", type: "video" as const, title: "네트워크 패킷 분석" },
    //         { id: "n15", type: "doc" as const, title: "네트워크 개요 문서" },
    //       ],
    //     },
    //     {
    //       id: "g8",
    //       title: "방화벽 우회",
    //       description: "리눅스를 통해 해킹을 실습해보고 배우는 강의",
    //       isCompleted: false,
    //       nodes: [
    //         { id: "n16", type: "video" as const, title: "우회 전략 강의" },
    //         { id: "n17", type: "image" as const, title: "우회 다이어그램" },
    //       ],
    //     },
    //   ],
    // },
  ],
};
