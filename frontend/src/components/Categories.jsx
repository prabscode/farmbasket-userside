// components/Categories.jsx
import { useState } from 'react';

const Categories = ({ onCategoryChange }) => {
  // Define categories with icons
  const categoryOptions = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'textiles', name: 'Textiles', icon: '🧵' },
    { id: 'pulses', name: 'Pulses', icon: '🥜' },
    { id: 'oilseeds', name: 'Oilseeds', icon: '🌱' },
    { id: 'other', name: 'Other', icon: '📦' }
  ];

  // Track the active category
  const [activeCategory, setActiveCategory] = useState('all');

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-whitesmoke border-b border-gray-200 ">
      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-3 pb-1">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200
                ${activeCategory === category.id 
                  ? 'bg-gray-900 text-white shadow-md hover:bg-gray-600  ' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-400 shadow-md hover:shadow-lg'}
                 focus:outline-none  border border-solid border-gray-900
              `}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;