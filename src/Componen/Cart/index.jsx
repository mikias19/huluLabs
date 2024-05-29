import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const CartSidebar = ({
  cartItems,
  isOpen,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.id === "cart-overlay") {
      onClose();
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price_range.minimum_price.regular_price.value * item.count,
    0
  );

  return (
    <div
      id="cart-overlay"
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Cart</h2>
          <button onClick={onClose} className="text-xl text-white">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="border-b py-4">
                <div className="flex items-center">
                  <img
                    src={item.image.url || ""}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4 rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-700">
                      {item.short_description.html ||
                        "No description available."}
                    </p>
                    <p className="text-xl font-bold">
                      ${item.price_range.minimum_price.regular_price.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.count}</span>
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 transition ml-4"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Your cart is empty.</p>
          )}
          {cartItems.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
