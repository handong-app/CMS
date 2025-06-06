// src/App.tsx

import { Outlet } from "react-router";
import { Box } from "@mui/material";
import MyAppBar from "./components/common/MyAppBar";

const App = () => {
  return (
    <>
      <MyAppBar position="relative" transparent />
      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
};

export default App;
