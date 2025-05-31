// src/components/GoogleLoginButton.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GoogleLoginButton from "./GoogleLoginButton";
import "@testing-library/jest-dom";


// window.location.href 모킹용
const originalLocation = window.location;

describe("GoogleLoginButton", () => {
  beforeEach(() => {
    // fetch와 alert를 초기화
    global.fetch = vi.fn();
    global.alert = vi.fn();

    // window.location.href mock
    delete window.location;
    window.location = { href: "" } as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it("renders the login button", () => {
    render(<GoogleLoginButton />);
    expect(screen.getByRole("button", { name: "구글 로그인 시작" })).toBeInTheDocument();
  });

  it("redirects to Google auth URL on successful fetch", async () => {
    const mockClientId = "fake-client-id";
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockClientId),
    });

    render(<GoogleLoginButton />);
    fireEvent.click(screen.getByText("구글 로그인 시작"));

    // fetch가 호출되었는지 확인
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/google/client-id")
    );

    // fetch 이후 window.location.href에 URL이 설정되는지 확인
    await new Promise((r) => setTimeout(r, 0)); // await 렌더 후 상태 반영

    expect(window.location.href).toContain("https://accounts.google.com/o/oauth2/v2/auth?");
    expect(window.location.href).toContain(mockClientId);
  });

  it("shows alert on fetch failure", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });

    render(<GoogleLoginButton />);
    fireEvent.click(screen.getByText("구글 로그인 시작"));

    await new Promise((r) => setTimeout(r, 0));

    expect(alert).toHaveBeenCalledWith("클라이언트 ID를 불러오지 못했습니다.");
  });
});
