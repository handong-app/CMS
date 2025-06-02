import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CoursePage from "./CoursePage";
import { MemoryRouter } from "react-router";

const renderComponent = () =>
  render(
    <MemoryRouter>
      <CoursePage />
    </MemoryRouter>
  );

describe("CoursePage", () => {
  it("renders the top course banner title", () => {
    renderComponent();
    // TopCourseBanner의 h1은 heading 역할을 가짐
    const headings = screen.getAllByRole("heading", {
      name: "시스템 해킹과 보안",
    });
    expect(headings.length).toBeGreaterThan(0);
  });

  it("renders the producer name", () => {
    renderComponent();
    expect(screen.getByText("20학번 이승현")).toBeInTheDocument();
  });

  it("renders the course progress list title", () => {
    renderComponent();
    // CourseProgressList의 타이틀은 heading이 아님, getAllByText로 중복 허용
    const titles = screen.getAllByText("시스템 해킹과 보안");
    expect(titles.length).toBeGreaterThan(1);
  });

  it("renders the info card title", () => {
    renderComponent();
    expect(screen.getByText("학습 현황")).toBeInTheDocument();
  });

  it("renders the section title from dummy data", () => {
    renderComponent();
    // 여러 곳에 1일차가 있으므로 getAllByText로 검사
    const sectionTitles = screen.getAllByText("1일차");
    expect(sectionTitles.length).toBeGreaterThan(0);
  });

  it("renders the group title from dummy data", () => {
    renderComponent();
    // 여러 곳에 리눅스 설치하기가 있으므로 getAllByText로 검사
    const groupTitles = screen.getAllByText("리눅스 설치하기");
    expect(groupTitles.length).toBeGreaterThan(0);
  });

  it("renders the node title from dummy data", () => {
    renderComponent();
    expect(screen.getByText("리눅스 세팅하기")).toBeInTheDocument();
  });
});
