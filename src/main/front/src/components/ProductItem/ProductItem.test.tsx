import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ProductItem from "./ProductItem";

describe("ProductItem", () => {
  const mockProps = {
    title: "테스트 상품",
    description: "이것은 테스트 상품 설명입니다.",
    price: 12345,
    thumbnail: "https://via.placeholder.com/180x180.png?text=Thumbnail",
  };

  it("title, description, price, thumbnail이 모두 보인다", () => {
    render(<ProductItem {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByText(/12,345원/)).toBeInTheDocument();
    const img = screen.getByAltText(mockProps.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockProps.thumbnail);
  });
});
