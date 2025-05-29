import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7AB8FF", // 서비스 메인 블루 (WCAG AA 대비율 ≥ 4.5)
      dark: "#0052CC", // main보다 더 어두운 블루
      contrastText: "#fff",
    },
    secondary: {
      main: "#FFD700", // 서비스 포인트 옐로우
      contrastText: "#222",
    },
    background: {
      default: "#181818",
      paper: "#23243a",
    },
    text: {
      primary: "#fff",
      secondary: "#b0b0b0",
    },
    grey: {
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#222",
    },
  },
  typography: {
    fontFamily: [
      "Pretendard Variable",
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "system-ui",
      "Roboto",
      "Helvetica Neue",
      "Segoe UI",
      "Apple SD Gothic Neo",
      "Noto Sans KR",
      "Malgun Gothic",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#fff",
    },
    h2: {
      fontSize: "1.2rem",
      fontWeight: 400,
      color: "#f5f5f5",
    },
  },
});

export default theme;
