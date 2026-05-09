import React from "react";
import ProductListingPage from "../components/ProductListingPage";

const Plants = () => {
  return (
    <ProductListingPage
      categoryId={1}
      badgeLabel="Cây cảnh"
      title="Danh mục cây cảnh"
      subtitle="Các mẫu cây được chia trang theo lô 8 sản phẩm để bố cục đều hơn, dễ xem và không bị kéo quá dài."
    />
  );
};

export default Plants;
