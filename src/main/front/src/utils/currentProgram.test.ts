import { describe, it, expect } from "vitest";
import { currentProgram } from "./currentProgram";

const samplePrograms = [
  {
    id: "prog1",
    name: "진행중 프로그램",
    startDate: "2025-06-01 00:00:00",
    endDate: "2025-06-30 23:59:59",
  },
  {
    id: "prog2",
    name: "종료된 프로그램",
    startDate: "2025-04-01 00:00:00",
    endDate: "2025-05-01 23:59:59",
  },
  {
    id: "prog3",
    name: "미래 프로그램",
    startDate: "2025-07-01 00:00:00",
    endDate: "2025-08-01 23:59:59",
  },
];

describe("currentProgram", () => {
  it("현재 날짜(2025-06-03)에 진행중인 프로그램만 반환한다", () => {
    const result = currentProgram(samplePrograms);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("prog1");
    expect(result[0].name).toBe("진행중 프로그램");
  });

  it("진행중인 프로그램이 없으면 빈 배열 반환", () => {
    const result = currentProgram([samplePrograms[1], samplePrograms[2]]);
    expect(result).toEqual([]);
  });
});
