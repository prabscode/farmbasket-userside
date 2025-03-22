// pages/ProductsPage.jsx
import React, { useState } from 'react';
import Products from './Products';
import SidebarFilter from '../components/SidebarFilter';

const ProductsPage = ({ userId }) => {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 10000],
    customerRating: [],
    deliveryTime: [],
    paymentOptions: []
  });

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="products-page-container flex">
      {/* Sidebar Filter */}
      <div className="w-1/4 p-4 border-r">
        <SidebarFilter onFilterChange={handleFilterChange} />
      </div>
      
      {/* Products Section */}
      <div className="w-3/4">
        <Products userId={userId} filters={filters} />
      </div>
    </div>
  );
};

export default ProductsPage;