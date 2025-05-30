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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
