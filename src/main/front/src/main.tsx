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
import CoursePage from "./pages/CoursePage.tsx";
import NodeGroupPage from "./pages/NodeGroupPage.tsx";

// 페이지 컴포넌트
import LandingPage from "./pages/LandingPage.tsx";
import GoogleCallback from "./pages/GoogleCallback.tsx";
import ProfilePage from "./pages/ProfilePage";
import ProfileRegistrationPage from "./pages/ProfileRegistrationPage.tsx";
import AuthTestPage from "./pages/AuthTestPage.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NodeGroupTest from "./pages/NodeGroupTest.tsx";
import { CLUB_ADMINMENU } from "./admin-club/pages/index.tsx";
import AdminRoot from "./admin-club/components/AdminRoot.tsx";
import ClubListPage from "./pages/ClubListPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // 👉 기본 경로로 접속 시 LandingPage 렌더링
        element: <LandingPage />,
      },
      {
        path: "google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "register",
        element: <ProfileRegistrationPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/land",
    element: <LandingPage />,
  },
  {
    path: "/product/:id",
    element: <ProductView />,
  },
  {
    path: "/club",
    element: <ClubListPage />,
  },
  {
    path: "/club/:club",
    element: <ClubPage />,
  },
  {
    path: "/club/:club/program/:program_name",
    element: <ProgramPage />,
  },
  {
    path: "club/:club/course/:course_name/nodegroup/:nodeGroupUUID",
    element: <NodeGroupPage />,
  },
  {
    path: "/club/:clubSlug/course/:courseSlug",
    element: <CoursePage />,
  },
  {
    path: "/auth-test",
    element: <AuthTestPage />,
  },
  {
    path: "/nodegroup-test",
    element: <NodeGroupTest />,
  },
  {
    path: "/club/:club/admin",
    Component: AdminRoot,
    children: [
      {
        index: true,
        // index(기본) 접근 시 ADMINMENU 첫번째 id로 리다이렉트
        loader: ({ params }) => {
          const club = params.club;
          return Response.redirect(
            `/club/${club}/admin/${CLUB_ADMINMENU[0].id}`,
            302
          );
        },
      },
      ...CLUB_ADMINMENU.map((menu) => ({
        path: `${menu.id}`,
        Component: menu.comp,
        children: menu.children,
        // 컴포넌트가 로그인 보호가 필요한 경우 아래와 같이 설정
        // element: <LoginProtected comp={menu.comp} />,
      })),
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
