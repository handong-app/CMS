import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NodeGroupPage from "../../pages/NodeGroupPage"; // 실제 경로에 맞게 수정
import { MemoryRouter } from "react-router";

import "@testing-library/jest-dom";

describe("NodeGroupPage", () => {
  test("renders the node group title", () => {
    render(
      <MemoryRouter>
        <NodeGroupPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Callein Node Group1")).toBeInTheDocument(); //일단 예시 노드그룹 제목
  });

  test("shows prompt when there are no comments", () => {
    render(
      <MemoryRouter>
        <NodeGroupPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/댓글을 추가해보세요!/i)[0]).toBeInTheDocument();
  });

  test("shows comment section when clicking emoji/comment box", () => {
    render(
      <MemoryRouter>
        <NodeGroupPage />
      </MemoryRouter>
    );

    const toggleBtn = screen.getAllByText(/댓글을 추가해보세요/)[0];
    fireEvent.click(toggleBtn);

    // 실제 CommentSection 내부에서 입력 폼이 뜬다고 가정
    expect(
      screen.getByPlaceholderText(/댓글을 입력하세요/)
    ).toBeInTheDocument();
  });
});

// describe("NodeGroupPage", () => {
//   it("renders the node group title", () => {
//     render(
//       <MemoryRouter>
//         <NodeGroupPage />
//       </MemoryRouter>
//     );
//     expect(screen.getByText("머신러닝 개요")).toBeInTheDocument(); // 예시 타이틀
//   });

//   it("renders all nodes with their IDs and index numbers", () => {
//     const { container } = render(
//       <MemoryRouter>
//         <NodeGroupPage />
//       </MemoryRouter>
//     );

//     const nodeIdTexts = screen.getAllByText(/node-/i); // 예: node-1, node-2...
//     expect(nodeIdTexts.length).toBeGreaterThan(0);

//     const indexNumbers = container.querySelectorAll("h4");
//     expect(indexNumbers.length).toBeGreaterThan(0);
//   });

//   it("shows comment section when clicking emoji/comment box", () => {
//     render(
//       <MemoryRouter>
//         <NodeGroupPage />
//       </MemoryRouter>
//     );

//     const commentToggleButton =
//       screen.getAllByText(/댓글을 추가해보세요|[0-9]+/)[0];
//     fireEvent.click(commentToggleButton);
//     expect(screen.getByText(/댓글을 추가해보세요/)).toBeInTheDocument();
//   });

//   it("shows prompt when there are no comments", () => {
//     render(
//       <MemoryRouter>
//         <NodeGroupPage />
//       </MemoryRouter>
//     );

//     const placeholder = screen.getAllByText(
//       /댓글을 추가해보세요|첫번째로 댓글을 남겨보세요!/
//     )[0];
//     expect(placeholder).toBeInTheDocument();
//   });
// });
