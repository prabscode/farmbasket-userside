import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const sortOptions = [
  { name: 'Most Popular', value: 'popular', current: true },
  { name: 'Best Rating', value: 'rating', current: false },
  { name: 'Newest', value: 'newest', current: false },
  { name: 'Price: Low to High', value: 'price_low_high', current: false },
  { name: 'Price: High to Low', value: 'price_high_low', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProductHeader = ({ onSearch, onSort, cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptionsState, setSortOptionsState] = useState(sortOptions);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Add useEffect to trigger search when typing
  useEffect(() => {
    // This triggers the search as you type
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  // No need for form submission logic anymore since search is real-time
  const handleSearch = (e) => {
    e.preventDefault(); // Still prevent default form submission
  };

  // Update to handle search as you type
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Search happens automatically via useEffect
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setSearchQuery('');
    // onSearch('') will be triggered by the useEffect
  };

  const handleSort = (selectedName) => {
    const updatedOptions = sortOptionsState.map(option => ({
      ...option,
      current: option.name === selectedName,
    }));
    setSortOptionsState([
      ...updatedOptions.filter(option => option.current),
      ...updatedOptions.filter(option => !option.current)
    ]);
    onSort(selectedName.toLowerCase().replace(/ /g, '_'));
    setShowSortOptions(false);
  };

  return (
    <div className="bg-white w-full ">
      <div className="w-full">
        <main className="w-full px-4  sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-200 pt-3 pb-3 w-full">
            <div className="w-full max-w-lg min-w-[300px]">
              <form onSubmit={handleSearch} className="relative">
                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-base border border-slate-200 rounded-md pl-3 pr-28 py-2.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Fresh Fruits, Quality Grains..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                {/* Add clear button when there's search text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute top-2.5 right-24 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute top-1.5 right-1.5 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                  Search
                </button>
              </form>
            </div>
            <div className="flex items-center">
              {/* Sort Dropdown */}
              <div className="relative inline-block text-left">
                <div>
                  <button
                    onClick={() => setShowSortOptions(!showSortOptions)}
                    className="group inline-flex justify-center text-sm font-medium bg-gray-800 px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none"
                  >
                    Sort
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {showSortOptions && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      {sortOptionsState.map((option) => (
                        <button
                          key={option.name}
                          onClick={() => handleSort(option.name)}
                          className={classNames(
                            option.current ? 'font-bold text-gray-900' : 'text-gray-500',
                            'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                          )}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Cart Button */}
              <div className="relative ml-4">
                <button
                  type="button"
                  className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none flex items-center ${cartItemCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Shopping Cart"
                  onClick={() => cartItemCount > 0 && navigate('/cart')}
                  disabled={cartItemCount === 0}
                >
                  {/* Shopping Cart SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductHeader;