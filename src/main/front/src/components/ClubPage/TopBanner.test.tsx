import { render, screen } from "@testing-library/react";
import TopBanner from "./TopBanner";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../styles/theme";

describe("TopBanner", () => {
  const renderTopBanner = () =>
    render(
      <ThemeProvider theme={theme}>
        <TopBanner
          title="Welcome to the Club"
          subtitle="Grow together with us!"
          image="https://example.com/banner.jpg"
        />
      </ThemeProvider>
    );

  it("renders the title", () => {
    renderTopBanner();
    expect(screen.getByText("Welcome to the Club")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    renderTopBanner();
    expect(screen.getByText("Grow together with us!")).toBeInTheDocument();
  });

  it("renders the banner image", () => {
    renderTopBanner();
    const img = screen.getByAltText(/banner/i);
    expect(img).toBeInTheDocument();
  });

  it("banner image has correct src", () => {
    renderTopBanner();
    const img = screen.getByAltText(/banner/i);
    expect(img).toHaveAttribute("src", "https://example.com/banner.jpg");
  });
});
