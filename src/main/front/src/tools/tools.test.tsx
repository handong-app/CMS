import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import {
  formatTimestamp,
  formatTimestampRelativeOrAbsolute,
  convertTextToLinks,
  removeDuplicates,
  getExtensionFromUrl,
  isImage,
  isVideo,
  getDateString,
  splitHtmlBr,
  getCurrentWeekdayString,
} from "./tools";

// 날짜 관련 테스트

describe("formatTimestamp", () => {
  it("returns default format", () => {
    const result = formatTimestamp("2025-05-27T12:34:56");
    expect(result).toMatch(/2025년 05월 27일/);
  });
  it("returns format with weekday", () => {
    const result = formatTimestamp("2025-05-27T12:34:56", true);
    expect(result).toMatch(/2025년 05월 27일/);
    expect(result).toMatch(/화요일/);
  });
});

describe("formatTimestampRelativeOrAbsolute", () => {
  it("returns relative time if within 24 hours", () => {
    const now = new Date();
    const date = new Date(now.getTime() - 1000 * 60 * 60); // 1시간 전
    const result = formatTimestampRelativeOrAbsolute(date.toISOString());
    expect(result).toMatch(/전$/);
  });
  it("returns absolute time if over 24 hours", () => {
    const date = new Date("2025-05-25T12:00:00");
    const result = formatTimestampRelativeOrAbsolute(date.toISOString());
    expect(result).toMatch(/2025년 05월 25일/);
  });
});

describe("convertTextToLinks", () => {
  it("converts URL to anchor tag", () => {
    const nodes = convertTextToLinks("hello https://test.com world");
    // a 태그가 포함되어 있는지 확인
    expect(nodes.some((n: any) => n.type === "a")).toBe(true);
  });
  it("returns only span if no URL", () => {
    const nodes = convertTextToLinks("hello world");
    expect(nodes.every((n: any) => n.type === "span")).toBe(true);
  });
});

describe("removeDuplicates", () => {
  it("removes duplicates by key", () => {
    const arr = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    const result = removeDuplicates(arr, "id");
    expect(result.length).toBe(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });
});

describe("getExtensionFromUrl", () => {
  it("extracts file extension from url", () => {
    expect(getExtensionFromUrl("http://a.com/test.png")).toBe("png");
    expect(getExtensionFromUrl("http://a.com/test.mp4?query=1")).toBe("mp4");
    expect(getExtensionFromUrl("http://a.com/test")).toBe("");
  });
});

describe("isImage", () => {
  it("returns true for image extension", () => {
    expect(isImage("http://a.com/test.jpg")).toBe(true);
    expect(isImage("http://a.com/test.PNG")).toBe(true);
  });
  it("returns false for non-image extension", () => {
    expect(isImage("http://a.com/test.mp4")).toBe(false);
  });
});

describe("isVideo", () => {
  it("returns true for video extension", () => {
    expect(isVideo("http://a.com/test.mp4")).toBe(true);
    expect(isVideo("http://a.com/test.WEBM")).toBe(true);
  });
  it("returns false for non-video extension", () => {
    expect(isVideo("http://a.com/test.png")).toBe(false);
    expect(isVideo("http://a.com/test")).toBe(false);
  });
});

describe("getDateString", () => {
  it("returns today date in yyyy-mm-dd format", () => {
    const result = getDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("splitHtmlBr", () => {
  it("splits by br tag", () => {
    expect(splitHtmlBr("a<br>b").length).toBe(2);
    expect(splitHtmlBr("a<br/>b").length).toBe(2);
    expect(splitHtmlBr("a<br >b").length).toBe(2);
  });
  it("returns original array if no br tag", () => {
    expect(splitHtmlBr("abc")).toEqual(["abc"]);
  });
});

describe("getCurrentWeekdayString", () => {
  it("returns 1st week Monday for 2025-03-03", () => {
    const date = new Date(2025, 2, 3); // 3월 3일
    expect(getCurrentWeekdayString(date)).toBe("1주차 월요일");
  });
  it("returns 1st week Sunday for 2025-03-09", () => {
    const date = new Date(2025, 2, 9);
    expect(getCurrentWeekdayString(date)).toBe("1주차 일요일");
  });
  it("returns 2nd week Monday for 2025-03-10", () => {
    const date = new Date(2025, 2, 10);
    expect(getCurrentWeekdayString(date)).toBe("2주차 월요일");
  });
});
