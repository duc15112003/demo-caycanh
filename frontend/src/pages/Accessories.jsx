import React from "react";
import ProductListingPage from "../components/ProductListingPage";

const Accessories = () => {
  return (
    <ProductListingPage
      categoryId={3}
      badgeLabel="Phụ kiện"
      title="Danh mục phụ kiện"
      subtitle="Phụ kiện chăm cây và trang trí được chia trang rõ ràng để người dùng xem nhanh hơn và bố cục cân hơn."
    />
  );
};

export default Accessories;
