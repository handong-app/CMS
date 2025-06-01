import { format, formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react";

export function formatTimestamp(
  timestamp: string | number | Date,
  dayWeek: boolean = false
): string {
  const date = new Date(timestamp);
  const dateFormat = dayWeek
    ? "yyyy년 MM월 dd일 EEEE a h:mm"
    : "yyyy년 MM월 dd일 a h:mm";

  return format(date, dateFormat, { locale: ko });
}

export function formatTimestampRelativeOrAbsolute(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: ko });
  } else {
    return formatTimestamp(timestamp);
  }
}

// Function to detect URLs and convert them to hyperlinks
export function convertTextToLinks(text: string): (JSX.Element | string)[] {
  // Regular expression to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split the text by URLs and map over the parts
  return text.split(urlRegex).map((part, index) => {
    // If the part matches the URL regex, return a hyperlink
    if (part.match(urlRegex)) {
      return (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    // Otherwise, return the text as it is
    return <span key={index}>{part}</span>;
  });
}

export function removeDuplicates<T, K extends keyof T>(arr: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

export const getExtensionFromUrl = (url: string) => {
  const cleanUrl = url.split("?")[0]; // Remove anything after '?'
  const lastSlash = cleanUrl.lastIndexOf("/");
  const fileName = lastSlash !== -1 ? cleanUrl.slice(lastSlash + 1) : cleanUrl;
  const dotIdx = fileName.lastIndexOf(".");
  if (dotIdx <= 0) return ""; // 확장자가 없거나 숨김파일(.git 등)인 경우
  return fileName.slice(dotIdx + 1).toLowerCase();
};

// Function to check if the URL is an image
export function isImage(url: string): boolean {
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "svg",
    "apng",
    "ico",
  ];
  const extension = getExtensionFromUrl(url);
  if (!extension) return false;
  return imageExtensions.includes(extension);
}

export function isVideo(url: string): boolean {
  const videoExtensions = [
    "mp4",
    "webm",
    "ogg",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
    "m4v",
    "3gp",
  ];
  const extension = getExtensionFromUrl(url);
  if (!extension) return false;
  return videoExtensions.includes(extension);
}

// Calculate net character difference between two strings
export function calculateDiffChange(
  oldValue: string,
  newValue: string
): string {
  let diff = newValue.length - oldValue.length;
  if (diff === 0) return "일치";
  return `${diff > 0 ? "+" : ""}${diff}`;
}

export const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function splitHtmlBr(str: string): string[] {
  if (typeof str !== "string") return [str as unknown as string];
  const BR_REGEX = /<br\s*\/?>/i;
  if (BR_REGEX.test(str)) {
    return str.split(BR_REGEX);
  }
  return [str];
}

export function getCurrentWeekdayString(date: Date = new Date()): string {
  // 2025년 3월 3일(월) 개강 기준
  const semesterStart = new Date(2025, 2, 3); // 월은 0부터 시작 (2=3월)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor(
    (date.getTime() - semesterStart.getTime()) / msPerDay
  );
  const week = Math.floor(daysPassed / 7) + 1;
  const weekdays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekday = weekdays[date.getDay()];
  return `${week}주차 ${weekday}`;
}

export function isJwtExpired(
  token: string,
  paddingSeconds: number = 60
): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000; // 초 단위
    // padding 만큼 미리 만료로 간주
    return decoded.exp < now + paddingSeconds;
  } catch (e) {
    return true; // 토큰이 잘못되었거나 디코딩 불가 → 만료 간주
  }
}
