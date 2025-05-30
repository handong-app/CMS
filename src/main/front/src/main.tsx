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
import { CLUB_ADMINMENU } from "./admin-club/pages/index.tsx";
import AdminRoot from "./admin-club/components/AdminRoot.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
  {
    path: "/club/:club/course/:course_name",
    element: <CoursePage />,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
