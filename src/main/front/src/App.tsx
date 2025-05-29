import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import MyAppBar from "./components/common/MyAppBar"; // 경로는 실제 위치에 맞게 조정
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
