import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductItem from "../components/ProductItem";
import type { ProductItemProps } from "../components/ProductItem";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductItemProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!product) return <div>상품 정보가 없습니다.</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
      <ProductItem
        title={product.title}
        description={product.description}
        price={product.price}
        thumbnail={product.thumbnail}
      />
    </div>
  );
}

export default ProductView;
