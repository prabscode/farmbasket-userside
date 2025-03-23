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

// pages/ProductsPage.jsx
return (
  <div className="flex min-h-screen mt-4">
    {/* Sidebar Filter */}
    <div className="w-1/5">
      <SidebarFilter onFilterChange={handleFilterChange} />
    </div>
    
    {/* Main Content Area */}
    <div className="w-4/5 flex flex-col">
      {/* Product Header positioned at the top of right column */}
      <ProductHeader
        onSearch={handleSearch}
        onSort={handleSort}
        cartItemCount={cart.length}
      />
      
      {/* Categories Component - below ProductHeader */}
      <Categories onCategoryChange={handleCategoryChange} />
      
      {/* Products Grid */}
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
);
};

export default ProductsPage;