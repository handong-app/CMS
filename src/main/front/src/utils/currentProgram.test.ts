import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { currentProgram } from "./currentProgram";

// 기준이 되는 mock 날짜: 2025-06-03T12:00:00Z
const MOCK_NOW = new Date("2025-06-03T12:00:00Z");

// 날짜 문자열을 YYYY-MM-DD HH:mm:ss 형태로 반환
function formatDate(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

// 상대 날짜 생성
function daysFromNow(days: number) {
  const d = new Date(MOCK_NOW);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

const samplePrograms = [
  {
    id: "prog1",
    name: "진행중 프로그램",
    startDate: daysFromNow(-2), // 2일 전
    endDate: daysFromNow(27), // 27일 후
  },
  {
    id: "prog2",
    name: "종료된 프로그램",
    startDate: daysFromNow(-63), // 63일 전
    endDate: daysFromNow(-33), // 33일 전
  },
  {
    id: "prog3",
    name: "미래 프로그램",
    startDate: daysFromNow(28), // 28일 후
    endDate: daysFromNow(59), // 59일 후
  },
];

describe("currentProgram", () => {
  let dateNowSpy: any;
  beforeAll(() => {
    // Date.now()를 mock
    dateNowSpy = vi
      .spyOn(Date, "now")
      .mockImplementation(() => MOCK_NOW.getTime());
  });
  afterAll(() => {
    dateNowSpy.mockRestore();
  });

  it("returns only the ongoing program at the mocked current date", () => {
    const result = currentProgram(samplePrograms);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("prog1");
    expect(result[0].name).toBe("진행중 프로그램");
  });

  it("returns an empty array if there is no ongoing program", () => {
    const result = currentProgram([samplePrograms[1], samplePrograms[2]]);
    expect(result).toEqual([]);
  });
});
