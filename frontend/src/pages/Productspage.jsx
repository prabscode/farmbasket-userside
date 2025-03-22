import React from 'react';
import Products from './Products';

const ProductsPage = ({ userId }) => {
  return (
    <div className="products-page-container">
      {/* This will eventually contain:
      - Sidebar filter
      - Search bar
      - Products list (current Products component)
      - Categories
      - Footer
      - Other components as needed
      */}
      <Products userId={userId} />
    </div>
  );
};

export default ProductsPage;