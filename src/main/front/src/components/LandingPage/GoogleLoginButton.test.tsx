import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GoogleLoginButton from "./GoogleLoginButton";
import "@testing-library/jest-dom";

describe("GoogleLoginButton", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { href: "" };
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  afterEach(() => {
    window.location = originalLocation as any;
    vi.restoreAllMocks();
  });

  it("renders the login button", () => {
    render(<GoogleLoginButton />);
    expect(
      screen.getByRole("button", { name: "구글 로그인 시작" })
    ).toBeInTheDocument();
  });

  it("redirects to Google auth URL on successful fetch", async () => {
    const mockClientId = "fake-client-id";
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockClientId),
    });

    render(<GoogleLoginButton />);
    fireEvent.click(screen.getByText("구글 로그인 시작"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/google/client-id")
      );
      expect(window.location.href).toContain(
        "https://accounts.google.com/o/oauth2/v2/auth?"
      );
      expect(window.location.href).toContain(mockClientId);
    });
  });

  it("shows alert on fetch failure", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });

    render(<GoogleLoginButton />);
    fireEvent.click(screen.getByText("구글 로그인 시작"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "클라이언트 ID를 불러오지 못했습니다."
      );
    });
  });
});
