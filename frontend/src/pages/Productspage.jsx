// pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import Products from './Products';
import SidebarFilter from '../components/SidebarFilter';
import ProductHeader from '../components/ProductHeader';
import Categories from '../components/Categories';

const ProductsPage = ({ userId }) => {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 10000],
    customerRating: [],
    deliveryTime: [],
    paymentOptions: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get cart from localStorage or another source
  useEffect(() => {
    // This is an example - replace with your actual cart retrieval logic
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handler for search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handler for sort
  const handleSort = (option) => {
    setSortOption(option);
  };

  // Handler for category changes
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar Filter */}
        <div className="w-1/4">
          <SidebarFilter onFilterChange={handleFilterChange} />
        </div>
        {/* Main Content Area */}
        <div className="w-3/4 flex flex-col">
          {/* Product Header positioned correctly */}
          <ProductHeader
            onSearch={handleSearch}
            onSort={handleSort}
            cartItemCount={cart.length}
          />
          {/* Categories Component - Added below ProductHeader */}
          <Categories onCategoryChange={handleCategoryChange} />
          {/* Products */}
          <div className="flex-1 overflow-auto">
            <Products
              userId={userId}
              filters={filters}
              searchQuery={searchQuery}
              sortOption={sortOption}
              setCart={setCart}
              category={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;