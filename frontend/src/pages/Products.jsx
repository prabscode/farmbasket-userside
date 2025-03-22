// pages/Products.jsx
import { useEffect, useState } from "react";
import Cart from "../components/Cart";

const Products = ({ userId: propUserId, filters = {} }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [localUserId, setLocalUserId] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products with all products
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Get userId from localStorage if not passed as prop
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Products component - userId from localStorage:", storedUserId);
    setLocalUserId(storedUserId);
  }, [propUserId]); // Re-check when prop userId changes

  // Apply filters when they change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

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
        if (!product.estimatedDelivery) return true;
        
        const deliveryDays = typeof product.estimatedDelivery === 'number' 
          ? product.estimatedDelivery 
          : parseInt(product.estimatedDelivery.split(' ')[0]) || 0;
        
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

    setFilteredProducts(result);
  }, [filters, products]);

  // Determine the effective userId to use
  const effectiveUserId = propUserId || localUserId;

  // Function to add product to cart
  const addToCart = (product) => {
    if (!effectiveUserId) {
      alert("Please log in to add items to cart");
      return;
    }
    
    const cartItem = {
      userId: effectiveUserId,
      farmerId: product.farmerId,
      productId: product._id || product.id, // Make sure to use the correct ID field
      name: product.name,
      price: product.price,
      image: product.image,
    };

    console.log("Adding to cart with userId:", effectiveUserId);
    setCart((prevCart) => [...prevCart, cartItem]);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Crops</h2>
      
      {/* Debug info - Remove in production */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <p>User ID: {effectiveUserId || "Not logged in"}</p>
        <p>Cart Items: {cart.length}</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg">
              <img 
                src={product.image || "https://via.placeholder.com/150"} 
                alt={product.name}
                className="w-full h-40 object-cover rounded-md" 
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
              {product.location && <p className="text-gray-500 text-sm">Location: {product.location}</p>}
              {product.rating && (
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                  <span className="ml-1 text-sm">({product.rating})</span>
                </div>
              )}
              {product.estimatedDelivery && (
                <p className="text-gray-500 text-sm">Delivery in: {product.estimatedDelivery}</p>
              )}
              <p className="text-gray-500 text-sm">Farmer ID: {product.farmerId}</p>
              <p className="text-gray-500 text-sm">Product ID: {product._id || product.id}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={!effectiveUserId}
              >
                {effectiveUserId ? "Add to Cart" : "Login to Add"}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg text-gray-500">No products match your current filters.</p>
            <p className="text-sm text-gray-400">Try adjusting your filter criteria.</p>
          </div>
        )}
      </div>
      
      {/* Cart Component */}
      <Cart cart={cart} userId={effectiveUserId} />
    </div>
  );
};

export default Products;