import React from "react";
import ProductListingPage from "../components/ProductListingPage";

const Pots = () => {
  return (
    <ProductListingPage
      categoryId={2}
      badgeLabel="Chậu cây"
      title="Danh mục chậu cây"
      subtitle="Danh sách chậu được hiển thị cùng hệ thẻ và cùng phân trang với các danh mục khác để giao diện thống nhất hơn."
    />
  );
};

export default Pots;
