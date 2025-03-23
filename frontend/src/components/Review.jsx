import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Review = ({ cartProducts, onPrevStep, userId }) => {
  // State to hold the address data
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  // Define shipping price as a constant to ensure consistency
  const SHIPPING_PRICE = 9.99;

  // Calculate subtotal from cart products
  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const subtotal = calculateSubtotal();

  // Fetch the latest address from the database
  useEffect(() => {
    const fetchLatestAddress = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/addresses');
        if (!response.ok) {
          throw new Error('Failed to fetch address data');
        }
        const addresses = await response.json();
        // Get the most recent address (last one in the array)
        if (addresses.length > 0) {
          setAddressData(addresses[addresses.length - 1]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching address:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLatestAddress();
  }, []);

  // Format the address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.address1}${addr.address2 ? ', ' + addr.address2 : ''}, ${addr.state}, ${addr.zip}`;
  };

  // Calculate the final total with shipping
  const finalTotal = (parseFloat(subtotal) + SHIPPING_PRICE).toFixed(2);

  // Function to handle order submission
  const handlePlaceOrder = async () => {
    if (!userId || !cartProducts || cartProducts.length === 0 || !addressData) {
      setError('Missing required information for order placement');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the order data structure
      const orderData = {
        userId: userId,
        addressId: addressData._id, // Assuming the address has an ID
        totalAmount: parseFloat(finalTotal),
        shippingCost: SHIPPING_PRICE,
        orderDate: new Date().toISOString(),
        orderStatus: 'pending',
        orderItems: cartProducts.map(product => ({
          productId: product.productId,
          farmerId: product.farmerId, 
          quantity: product.quantity || 1,
          price: product.price
        }))
      };

      // Send the order data to your backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);
      setOrderSuccess(true);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Redirect to order confirmation page
      navigate('/order-confirmation', { state: { orderId: result._id } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Review your order</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {orderSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Order placed successfully!</div>}

      <div className="space-y-4">
        {/* Order summary section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Products</span>
              <div className="text-sm text-gray-500">
                <ul className="list-disc pl-5 mt-2">
                  {cartProducts?.map(product => (
                    <li key={product.productId}>
                      {product.name} ({product.quantity || 1} kg)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="font-medium">${subtotal}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Shipping</span>
              <div className="text-sm text-gray-500">Plus taxes</div>
            </div>
            <span className="font-medium">${SHIPPING_PRICE.toFixed(2)}</span>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">${finalTotal}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Shipment details section */}
        <div className="space-y-2">
          <h3 className="font-medium">Shipment details</h3>
          {loading ? (
            <p>Loading address information...</p>
          ) : error ? (
            <p className="text-red-500">Error loading address: {error}</p>
          ) : addressData ? (
            <>
              <p className="text-gray-800">{addressData.firstName} {addressData.lastName}</p>
              <p className="text-gray-500">{formatAddress(addressData)}</p>
              <p className="text-gray-500">Phone: +91 {addressData.phone}</p>
            </>
          ) : (
            <p className="text-yellow-500">No address information found</p>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="text-gray-600 flex items-center hover:text-gray-900"
            onClick={onPrevStep}
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </button>
          <button
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || loading || !addressData}
          >
            {isSubmitting ? 'Processing...' : 'Place order'}
            {!isSubmitting && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;