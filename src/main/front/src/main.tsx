import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import "./index.css";
import ProductView from "./pages/ProductView.tsx";
import ProgramPage from "./pages/ProgramPage.tsx";
import ClubPage from "./pages/ClubPage.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styles/theme";

import LandingPage from "./pages/LandingPage"; // 랜딩 페이지 추가
import GoogleCallback from "./pages/GoogleCallback"; // 콜백 추가
import ProfileRegistrationPage from "./pages/ProfileRegistrationPage"; // 프로필 등록 페이지 추가

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [ // ✅ 여기에 LandingPage 포함시켜야 Outlet이 동작함
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "/google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "/register",
        element: <ProfileRegistrationPage />,
      },
    ],
  },
  {
    path: "/product/:id",
    element: <ProductView />,
  },
  {
    path: "/club/:club",
    element: <ClubPage />,
  },
  {
    path: "/club/:club/program/:program_name",
    element: <ProgramPage />,
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
