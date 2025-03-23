import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Info from "../components/Info"; // Import the Info component

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    zipcode: "",
  });
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Load cart and userId on component mount
  useEffect(() => {
    // Get cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  // Calculate cart totals
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Handle input change for the form fields
  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle removing item from cart
  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle form submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Please log in to complete your purchase");
      return;
    }
    // Prepare order data for backend
    const orderData = {
      userId,
      products: cart.map(item => ({
        productId: item.productId,
        farmerId: item.farmerId,
        quantity: item.quantity || 1
      })),
      shippingDetails: orderDetails,
      totalAmount: calculateTotal()
    };
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      const data = await response.json();
      alert("Order placed successfully!");
      // Clear cart after successful order
      setCart([]);
      localStorage.removeItem('cart');
      // Close the form
      setIsCheckoutOpen(false);
      // Redirect to home or order confirmation page
      navigate('/');
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Checkout error:", error);
    }
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Empty cart case
  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {/* Main content with two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Cart items and checkout button */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({cart.length})</h2>
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-gray-600 border-b pb-2">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Cart items */}
              {cart.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b">
                  {/* Product info */}
                  <div className="col-span-1 md:col-span-6 flex items-center">
                    <div className="w-16 h-16 mr-4 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 text-sm mt-1 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                    <div className="md:hidden text-gray-600 mr-2">Price:</div>
                    <div>₹{item.price.toFixed(2)}</div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                    <div className="md:hidden text-gray-600 mr-2">Quantity:</div>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.productId, (item.quantity || 1) - 1)}
                        className="px-3 py-1 bg-gray-100 border-r hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, (item.quantity || 1) + 1)}
                        className="px-3 py-1 bg-gray-100 border-l hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                    <div className="md:hidden text-gray-600 mr-2">Total:</div>
                    <div className="font-medium">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              
              {/* Checkout buttons */}
              <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-center">
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mb-4 md:mb-0"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Order summary (Info component) */}
        <div className="lg:col-span-1">
          <Info 
            cart={cart} 
            calculateTotal={calculateTotal} 
            onRemoveItem={handleRemoveItem} 
          />
        </div>
      </div>

      {/* Checkout Form */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <form onSubmit={handleCheckout}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border rounded-md"
                  value={orderDetails.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full p-2 border rounded-md"
                  value={orderDetails.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full p-2 border rounded-md"
                    value={orderDetails.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="state">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="w-full p-2 border rounded-md"
                    value={orderDetails.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="zipcode">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    className="w-full p-2 border rounded-md"
                    value={orderDetails.zipcode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-2 border rounded-md"
                    value={orderDetails.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="flex justify-between border-t pt-2">
                  <span>Total ({cart.length} items):</span>
                  <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;