import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Info from "../components/Info";
import AddressForm from "../components/AddressForm";
import Review from "../components/Review";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState("address"); // "address" or "review"
  const [showAddressForm, setShowAddressForm] = useState(true);
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

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!userId) {
      alert("Please log in to proceed to checkout");
      return;
    }
    setShowAddressForm(true);
    setCurrentStep("address");
  };

  // Handle address saved and move to review step
  const handleAddressSaved = () => {
    setCurrentStep("review");
  };

  // Handle going back to address form
  const handleBackToAddress = () => {
    setCurrentStep("address");
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
      
      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${currentStep === "address" ? "text-green-500" : "text-gray-500"}`}>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === "address" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
            1
          </div>
          <span className="ml-2">Shipping address</span>
        </div>
        <div className="mx-4 h-1 w-16 bg-gray-200"></div>
        <div className={`flex items-center ${currentStep === "review" ? "text-green-500" : "text-gray-500"}`}>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep === "review" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
            2
          </div>
          <span className="ml-2">Review your order</span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Show either AddressForm or Review component */}
        <div className="lg:col-span-2">
          {currentStep === "address" ? (
            <AddressForm
              cartProducts={cart.map(item => ({
                id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1
              }))}
              onQuantityChange={handleQuantityChange}
              onAddressSaved={handleAddressSaved}
            />
          ) : (
            <Review
              cartProducts={cart}
              onPrevStep={handleBackToAddress}
              userId={userId}
            />
          )}
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
    </div>
  );
};

export default CartPage;