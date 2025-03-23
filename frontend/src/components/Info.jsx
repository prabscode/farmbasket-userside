import React from 'react';

const Info = ({ cart, calculateTotal, onRemoveItem }) => {
  // Define shipping price as a constant
  const SHIPPING_PRICE = 40.00;
  
  // Calculate the final total with shipping
  const subtotal = calculateTotal();
  const finalTotal = subtotal + SHIPPING_PRICE;

  return (
    <div className="space-y-4">
      {/* Order summary totals */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Shipping</span>
            <span className="text-gray-500">₹{SHIPPING_PRICE.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-gray-400">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Total</span>
              <span className="font-bold">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
          <span className="ml-1 text-sm text-gray-500">({cart.length})</span>
        </div>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="relative border-t border-gray-200 pt-4">
{/* Close button */}
<button
  onClick={() => onRemoveItem(item.productId)}
  className="absolute top-2 right-0 w-6 h-6  flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors duration-200"
>
  ×
</button>
              
              <div className="flex items-start pr-6">
                {/* Product Image */}
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs">No img</span>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="ml-3 flex-grow">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  {item.category && (
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-600 mt-1">
                      {item.category}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.quantity || 1} kg
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Farmer ID: {item.farmerId || "Unknown"}
                  </p>
                </div>
                
                {/* Price */}
                <div className="mt-12 ml-4 flex-shrink-0">
                  <span className="inline-block bg-gray-900 text-white rounded-sm px-2 py-1 text-xs font-medium">
                    ₹{((item.price * (item.quantity || 1))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Perks section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-center text-gray-700 font-medium mb-6">The perks of every order</h3>
        <div className="flex justify-center space-x-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">🍎</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Fresh and High Quality</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">🚚</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center mb-2">
              <span className="text-xl">🛡️</span>
            </div>
            <span className="text-xs text-gray-500 text-center">Trusted Sellers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;