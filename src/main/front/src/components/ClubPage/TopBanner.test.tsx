import { render, screen } from "@testing-library/react";
import TopBanner from "./TopBanner";

describe("TopBanner", () => {
  const renderTopBanner = () =>
    render(
      <TopBanner
        title="Welcome to the Club"
        subtitle="Grow together with us!"
        image="https://example.com/banner.jpg"
      />
    );

  it("renders the title", () => {
    renderTopBanner();
    expect(screen.getByText("Welcome to the Club")).to.exist;
  });

  it("renders the subtitle", () => {
    renderTopBanner();
    expect(screen.getByText("Grow together with us!")).to.exist;
  });

  it("renders the banner image", () => {
    renderTopBanner();
    const img = screen.getByAltText(/banner/i);
    expect(img).to.exist;
  });

  it("banner image has correct src", () => {
    renderTopBanner();
    const img = screen.getByAltText(/banner/i);
    expect(img.getAttribute("src")).to.equal("https://example.com/banner.jpg");
  });
});
