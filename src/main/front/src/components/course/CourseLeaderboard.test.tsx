import userEvent from "@testing-library/user-event";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseLeaderboard, { CourseLeaderboardItem } from "./CourseLeaderboard";

describe("CourseLeaderboard", () => {
  const items: CourseLeaderboardItem[] = [
    {
      name: "김리더",
      progress: 98,
      lastStudiedAt: "2025-05-29T09:10:00",
    },
    {
      name: "박열정",
      progress: 85,
      lastStudiedAt: "2025-05-28T22:10:00",
    },
    {
      name: "이성실",
      progress: 70,
      lastStudiedAt: "2025-05-28T20:00:00",
    },
    {
      name: "최꾸준",
      progress: 60,
      lastStudiedAt: "2025-05-27T18:30:00",
    },
    {
      name: "정새싹",
      progress: 40,
      lastStudiedAt: "2025-05-26T15:00:00",
    },
    {
      name: "오열심",
      progress: 55,
      lastStudiedAt: "2025-05-27T10:45:00",
    },
    {
      name: "유도전",
      progress: 35,
      lastStudiedAt: "2025-05-25T14:20:00",
    },
    {
      name: "임성장",
      progress: 80,
      lastStudiedAt: "2025-05-28T19:00:00",
    },
    {
      name: "문새벽",
      progress: 25,
      lastStudiedAt: "2025-05-24T07:30:00",
    },
    {
      name: "장도전",
      progress: 50,
      lastStudiedAt: "2025-05-26T21:10:00",
    },
    {
      name: "배지각",
      progress: 65,
      lastStudiedAt: "2025-05-27T23:55:00",
    },
    {
      name: "신성실",
      progress: 90,
      lastStudiedAt: "2025-05-29T08:00:00",
    },
    {
      name: "황근면",
      progress: 30,
      lastStudiedAt: "2025-05-25T09:40:00",
    },
    {
      name: "서노력",
      progress: 45,
      lastStudiedAt: "2025-05-26T18:15:00",
    },
    {
      name: "조성취",
      progress: 20,
      lastStudiedAt: "2025-05-23T16:00:00",
    },
  ];

  const renderComponent = (
    props?: Partial<{ items: CourseLeaderboardItem[] }>
  ) => render(<CourseLeaderboard myName="서노력" {...props} />);

  it("shows all rows when Show All button is clicked", async () => {
    // 더미 데이터가 6명 이상일 때만 전체보기 버튼이 나타난다. (defaultItems는 15명)
    renderComponent();
    const showAllButton = screen.getByRole("button", { name: /전체보기/ });
    expect(showAllButton).toBeInTheDocument();
    await userEvent.click(showAllButton);
    // 전체보기 클릭 후 defaultItems의 모든 이름이 보이는지 확인 (예: 중간 문새벽)
    expect(screen.getByText("문새벽")).toBeInTheDocument();
  });

  it("renders leaderboard table headers", () => {
    renderComponent({ items });
    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("renders progress column header", () => {
    renderComponent({ items });
    expect(screen.getByText("학습율")).toBeInTheDocument();
  });

  it("renders last studied column header", () => {
    renderComponent({ items });
    expect(screen.getByText("마지막 학습")).toBeInTheDocument();
  });

  it("renders first user name", () => {
    renderComponent({ items });
    expect(screen.getByText("김리더")).toBeInTheDocument();
  });

  it("renders second user name", () => {
    renderComponent({ items });
    expect(screen.getByText("박열정")).toBeInTheDocument();
  });

  it("shows progress percent for first user", () => {
    renderComponent({ items });
    expect(screen.getByText("98%")).toBeInTheDocument();
  });

  it("shows progress percent for second user", () => {
    renderComponent({ items });
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("shows rank number 1", () => {
    renderComponent({ items });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows rank number 2", () => {
    renderComponent({ items });
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows formatted last studied date for first user", () => {
    renderComponent({ items });
    // 상대 시간 또는 yyyy년 MM월 dd일 형태 중 하나가 나옴
    const found = screen.getAllByText(/전$|년/);
    expect(found.length).toBeGreaterThan(0);
  });

  it("renders default data if no items prop is given", () => {
    renderComponent();
    expect(screen.getByText("김리더")).toBeInTheDocument();
  });

  it("shows (나) label for myName row", () => {
    render(<CourseLeaderboard items={items} myName="서노력" />);
    expect(screen.getByText("서노력")).toBeInTheDocument();
    expect(screen.getByText("(나)")).toBeInTheDocument();
  });
});
