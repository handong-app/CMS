import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseLeaderboard, { CourseLeaderboardItem } from "./CourseLeaderboard";

describe("CourseLeaderboard", () => {
  const items: CourseLeaderboardItem[] = [
    { name: "홍길동", progress: 90, lastStudiedAt: "2025-05-29T09:00:00" },
    { name: "김철수", progress: 80, lastStudiedAt: "2025-05-28T20:00:00" },
  ];

  const renderComponent = (
    props?: Partial<{ items: CourseLeaderboardItem[] }>
  ) => render(<CourseLeaderboard {...props} />);

  it("renders leaderboard table headers", () => {
    renderComponent({ items });
    expect(screen.getByText("이름")).toBeInTheDocument();
    expect(screen.getByText("학습율")).toBeInTheDocument();
    expect(screen.getByText("마지막 학습")).toBeInTheDocument();
  });

  it("renders all user names", () => {
    renderComponent({ items });
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("김철수")).toBeInTheDocument();
  });

  it("shows progress percent for each user", () => {
    renderComponent({ items });
    expect(screen.getByText("90%"));
    expect(screen.getByText("80%"));
  });

  it("shows rank number for each row", () => {
    renderComponent({ items });
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows formatted last studied date", () => {
    renderComponent({ items });
    // 상대 시간 또는 yyyy년 MM월 dd일 형태 중 하나가 나옴
    expect(screen.getAllByText(/전$|년/).length).toBeGreaterThan(0);
  });

  it("renders default data if no items prop is given", () => {
    renderComponent();
    // defaultItems의 첫 번째 이름이 보이는지 확인
    expect(screen.getByText("김리더")).toBeInTheDocument();
  });
});
