// src/App.tsx

import React from "react";
import { Outlet } from "react-router";
import { Box } from "@mui/material";
import MyAppBar from "./components/common/MyAppBar";
import useAuthStore from "./store/authStore";

const App = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <MyAppBar user={user} />
      <Box component="main" mt={2}>
        <Outlet />
      </Box>
    </>
  );
};

export default App;
