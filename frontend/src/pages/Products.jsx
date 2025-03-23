import { useEffect, useState } from "react";
import { MapPin, Heart, Share, User } from "lucide-react";

// ProductCard Component
const ProductCard = ({ product, effectiveUserId, addToCart, removeFromCart, cart, setActiveCategory }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  // Check if THIS specific product is in cart by comparing product ID
  const isInCart = cart.some(item => item.productId === product._id);
  
  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  const handleShareClick = (e) => {
    e.stopPropagation();
    console.log("Sharing product:", product.name);
  };
  
  const handleFarmerProfileClick = (e) => {
    e.stopPropagation();
    console.log("Opening farmer profile for:", product.farmerName, "with ID:", product.farmerId);
    window.open(`/farmer-profile/${product.farmerId}`, "_blank");
  };
  
  const handleCategoryClick = (e) => {
    e.stopPropagation();
    if (setActiveCategory && product.category) {
      setActiveCategory(product.category);
    }
  };
  
  // Handle cart button click for this specific product
  const handleCartButtonClick = () => {
    if (isInCart) {
      removeFromCart(product);
    } else {
      addToCart(product);
    }
  };
  
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {/* Header - Crop Name with dark background */}
      <div className="p-3 border-b border-gray-100 bg-gray-900 flex justify-between items-center">
        <h3 className="font-bold text-white truncate">{product.cropName || product.name}</h3>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-52 bg-gray-200 flex items-center justify-center p-3">
        <div className="relative w-full h-full overflow-hidden border border-gray-900 rounded-lg p-1">
          <img
            src={product.image || "https://res.cloudinary.com/john-mantas/image/upload/v1537291846/codepen/delicious-apples/green-apple-with-slice.png"}
            alt={product.cropName || product.name}
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4 flex flex-col bg-gray-200">
        {/* Action Buttons */}
        <div className="flex justify-between mb-3">
          <div className="flex">
            <button onClick={handleLikeClick} className="mr-4 hover:scale-110 transition-transform">
              <Heart
                size={22}
                stroke={isLiked ? "#d95552" : "#555"}
                fill={isLiked ? "#d95552" : "none"}
                className="transition-colors duration-300"
              />
            </button>
            <button onClick={handleShareClick} className="mr-4 hover:scale-110 transition-transform">
              <Share
                size={22}
                stroke="#555"
                className="transition-colors duration-300 hover:stroke-gray-700"
              />
            </button>
          </div>
          
          {/* Farmer Profile Button */}
          <button
            onClick={handleFarmerProfileClick}
            className="hover:scale-110 transition-transform relative group"
          >
            <User
              size={22}
              stroke="#555"
              className="transition-colors duration-300 hover:stroke-gray-700"
            />
            <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              View Farmer: {product.farmerName || "Unknown"}
            </span>
          </button>
        </div>
        
        {/* Category Button - Now linked with category component */}
        <span
          onClick={handleCategoryClick}
          className="inline-block bg-gradient-to-r from-gray-300 to-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-900 mb-3 w-fit cursor-pointer hover:from-gray-400 hover:to-gray-400 transition-all duration-300"
        >
          {product.category || "Other"}
        </span>
        
        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={14} className="mr-1 text-gray-400" />
          <span className="truncate">{product.location || "Unknown Location"}</span>
        </div>
        
        {/* Stock and Delivery Info */}
        <div className="text-gray-600 text-sm space-y-2 mb-4">
          <p>Stock: {product.stock || 0}</p>
          <p>Estimated Delivery: {product.estimatedDeliveryTime || "Unknown"}</p>
          {/* Added Product and Farmer IDs */}
          <p>Product ID: {product._id || "N/A"}</p>
          <p>Farmer ID: {product.farmerId || "N/A"}</p>
        </div>
        
        {/* Price and Add to Cart Button */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-900 mt-2 -mx-4 -mb-4 rounded-b-xl">
          <div className="text-white font-sans">
            <span className="text-lg font-light">₹</span>
            <span className="text-2xl font-semibold ml-0.5">{product.price}</span>
          </div>
          <button
            onClick={handleCartButtonClick}
            className={`px-4 py-1.5 ${isInCart ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-900 hover:bg-blue-700'} text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow text-sm`}
            disabled={!effectiveUserId}
          >
            {!effectiveUserId ? "Login to Add" : isInCart ? "Remove" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Products Component
const Products = ({
  userId: propUserId,
  filters = {},
  searchQuery = '',
  sortOption = 'popular',
  category = 'all'
}) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [localUserId, setLocalUserId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(category);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products on component mount
  useEffect(() => {
    setLoading(true);
    console.log("Fetching products...");
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        // Handle direct array of products
        if (Array.isArray(data)) {
          // If the API returns an array of farmer objects with works arrays
          let allProducts = [];
          data.forEach(farmerData => {
            if (farmerData.works && Array.isArray(farmerData.works)) {
              // Extract each work item as a product with farmer info
              farmerData.works.forEach(workItem => {
                // Add a unique _id to each product if it doesn't have one
                const productId = workItem._id || `${farmerData._id}-${workItem.cropName}-${Math.random().toString(36).substr(2, 9)}`;
                allProducts.push({
                  ...workItem,
                  _id: productId, // Ensure each product has a unique ID
                  farmerName: farmerData.farmerName,
                  farmerId: farmerData._id,
                  phoneNumber: farmerData.phoneNumber,
                  name: workItem.cropName, // Ensure we have a name property
                  // Add any default values or transformations needed
                  rating: Math.floor(Math.random() * 5) + 1 // Example random rating
                });
              });
            } else {
              // If it's a direct product object
              allProducts.push({
                ...farmerData,
                _id: farmerData._id || `product-${Math.random().toString(36).substr(2, 9)}`
              });
            }
          });
          console.log("Transformed products:", allProducts);
          setProducts(allProducts);
          setFilteredProducts(allProducts);
        } else {
          console.error("Unexpected API response format:", data);
          setError("Unexpected data format from API");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get userId from localStorage if not passed as prop
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Products component - userId from localStorage:", storedUserId);

    setLocalUserId(storedUserId);
  }, [propUserId]);

  // Apply filters, search, sort, and category when they change
  useEffect(() => {
    if (products.length === 0) return;
    console.log("Filtering products with:", {
      category,
      searchQuery,
      filters,
      sortOption
    });
    // Start with all products
    let result = [...products];
    
    // Apply category filter
    if (category && category !== 'all') {
      result = result.filter(product =>
        product.category &&
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Enhanced search filter to search through all properties
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => {
        // Convert product to string for easy searching across all fields
        const productStr = JSON.stringify(product).toLowerCase();
        return productStr.includes(query) ||
          // Explicit checks for common fields
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.cropName && product.cropName.toLowerCase().includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query)) ||
          (product.location && product.location.toLowerCase().includes(query)) ||
          // Convert price to string and check
          (product.price !== undefined && product.price.toString().includes(query));
      });
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(product =>
        product.location && product.location.includes(filters.location)
      );
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange;
      result = result.filter(product =>
        product.price >= min && product.price <= max
      );
    }
    
    // Apply customer rating filter
    if (filters.customerRating && filters.customerRating.length > 0) {
      const minRating = Math.min(...filters.customerRating);
      result = result.filter(product =>
        product.rating >= minRating
      );
    }
    
    // Apply delivery time filter
    if (filters.deliveryTime && filters.deliveryTime.length > 0) {
      result = result.filter(product => {
        if (!product.estimatedDeliveryTime) return true;
        const deliveryDays = typeof product.estimatedDeliveryTime === 'number'
          ? product.estimatedDeliveryTime
          : parseInt(product.estimatedDeliveryTime.split(' ')[0]) || 0;
        return (
          (filters.deliveryTime.includes("next_day") && deliveryDays <= 1) ||
          (filters.deliveryTime.includes("2-3_days") && deliveryDays >= 2 && deliveryDays <= 3) ||
          (filters.deliveryTime.includes("4-7_days") && deliveryDays >= 4 && deliveryDays <= 7)
        );
      });
    }
    
    // Apply payment options filter
    if (filters.paymentOptions && filters.paymentOptions.length > 0) {
      result = result.filter(product =>
        product.paymentOptions && filters.paymentOptions.some(option =>
          product.paymentOptions.includes(option)
        )
      );
    }
    
    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'popular':
          // Assuming you have a popularity field, or using rating as a proxy
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          // Assuming you have a createdAt field
          result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'price_low_high':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_high_low':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        default:
          break;
      }
    }
    
    console.log("Filtered products count:", result.length);
    setFilteredProducts(result);
  }, [filters, products, searchQuery, sortOption, category]);

  // Determine the effective userId to use
  const effectiveUserId = propUserId || localUserId;

  // Function to add product to cart
  const addToCart = (product) => {
    if (!effectiveUserId) {
      alert("Please log in to add items to cart");
      return;
    }
    
    // Check if the product is already in the cart
    if (cart.some(item => item.productId === product._id)) {
      console.log("Product already in cart, not adding again");
      return;
    }
    
    const cartItem = {
      userId: effectiveUserId,
      farmerId: product.farmerId,
      productId: product._id,
      name: product.cropName || product.name,
      price: product.price,
      image: product.image,
      quantity: 1, // Add quantity for cart functionality
    };
    
    console.log("Adding to cart:", cartItem);
    
    // Update local state
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    
    // Store in localStorage for persistence
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to remove product from cart
  const removeFromCart = (product) => {
    console.log("Removing from cart, product ID:", product._id);
    const updatedCart = cart.filter(item => item.productId !== product._id);
    setCart(updatedCart);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    console.log("Setting active category:", newCategory);
    setActiveCategory(newCategory.toLowerCase());
    
    // Find the corresponding category in the Categories component format
    // This creates a link between the product card category and main category component
    const categoryMapping = {
      "grains": "grains",
      "spices": "spices",
      "fruits": "fruits",
      "textiles": "textiles",
      "pulses": "pulses",
      "oilseeds": "oilseeds",
      "other": "other"
    };
    
    // Get the standard category ID or fallback to 'other'
    const standardCategoryId = categoryMapping[newCategory.toLowerCase()] || "other";
    
    // This would typically be passed to a parent component to update the Categories component
    // But for now, we'll just log it
    console.log("Category mapped to:", standardCategoryId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Available Crops</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Available Crops</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Crops</h2>
      
      {/* Debug info - Remove in production */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <p>User ID: {effectiveUserId || "Not logged in"}</p>
        <p>Cart Items: {cart.length}</p>
        <p>Products Count: {products.length}</p>
        <p>Filtered Products: {filteredProducts.length}</p>
        <p>Search Query: {searchQuery || "None"}</p>
        <p>Sort Option: {sortOption}</p>
        <p>Active Category: {category}</p>
        <p>Active Filters: {Object.entries(filters)
          .filter(([key, value]) =>
            (Array.isArray(value) && value.length > 0) ||
            (!Array.isArray(value) && value)
          )
          .map(([key]) => key)
          .join(', ') || 'None'}</p>
      </div>
      
      {/* Filter Tags */}
      {Object.entries(filters).some(([key, value]) =>
        (Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && value)
      ) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.location && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Location: {filters.location}
            </span>
          )}
          {filters.priceRange && filters.priceRange.length === 2 && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
            </span>
          )}
          {filters.customerRating && filters.customerRating.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Rating: {Math.min(...filters.customerRating)}+ Stars
            </span>
          )}
          {filters.deliveryTime && filters.deliveryTime.length > 0 && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
              Delivery: {filters.deliveryTime.map(dt =>
                dt === "next_day" ? "Next Day" :
                dt === "2-3_days" ? "2-3 Days" :
                "4-7 Days"
              ).join(', ')}
            </span>
          )}
          {filters.paymentOptions && filters.paymentOptions.length > 0 && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
              Payment: {filters.paymentOptions.map(po =>
                po === "cod" ? "COD" :
                po === "online" ? "Online" :
                po === "upi" ? "UPI" :
                "Card"
              ).join(', ')}
            </span>
          )}
        </div>
      )}
      
      {/* Search result info */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
          </p>
        </div>
      )}
      
      {/* Category info */}
      {category && category !== 'all' && (
        <div className="mb-4">
          <p className="text-gray-600">
            Category: <span className="font-semibold capitalize">{category}</span>
          </p>
        </div>
      )}
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              effectiveUserId={effectiveUserId}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cart={cart}
              setActiveCategory={handleCategoryChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-500">No products match your current criteria.</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
      
      {/* Cart Component has been removed from here */}
    </div>
  );
};

export default Products;