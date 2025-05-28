import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductItem from "../components/ProductItem/ProductItem";
import { ProductItemProps } from "../types/product.types";
import { useFetchBe } from "../tools/api";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductItemProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBe = useFetchBe();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBe("/products/" + id)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id, fetchBe]);

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
