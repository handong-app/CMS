import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../styles/theme";
import CourseProgress from "./CourseProgress";

describe("CourseProgress", () => {
  const renderComponent = (value: number) =>
    render(
      <ThemeProvider theme={theme}>
        <CourseProgress value={value} />
      </ThemeProvider>
    );

  it("renders the progress bar with correct percentage text", () => {
    renderComponent(0.45);
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders 0% when value is 0", () => {
    renderComponent(0);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders 100% when value is 1", () => {
    renderComponent(1);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
