// components/ProductHeader.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductHeader = ({ onSearch, onSort, cartItemCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleSortOptionClick = (sortOption) => {
    onSort(sortOption);
    setShowSortOptions(false);
  };
  
  return (
    <div className="w-full flex justify-center items-center py-3 px-4 border-b">
      <div className="w-full max-w-4xl flex justify-between items-center">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md mx-auto">
          <input
            type="text"
            placeholder="Fresh Fruits, Quality Grains..."
            className="w-full py-2 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button 
            type="submit" 
            className="absolute right-0 top-0 h-full px-3 bg-gray-800 text-white rounded-r-md flex items-center"
          >
            <span>Search</span>
          </button>
        </form>
        
        {/* Sort and Cart Buttons */}
        <div className="flex items-center ml-4 space-x-2">
          {/* Sort Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center px-4 py-2 border rounded-md bg-gray-800 text-white"
            >
              <span>Sort</span> <span className="ml-1">▼</span>
            </button>
            
            {/* Sort Options Dropdown */}
            {showSortOptions && (
              <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                <ul>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                    onClick={() => handleSortOptionClick('popular')}
                  >
                    Most Popular
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSortOptionClick('rating')}
                  >
                    Best Rating
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSortOptionClick('newest')}
                  >
                    Newest
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSortOptionClick('price_low_high')}
                  >
                    Price: Low to High
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSortOptionClick('price_high_low')}
                  >
                    Price: High to Low
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Cart Button */}
          <Link to="/cart" className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            <span className="text-lg">🛒</span>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;