import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./wishlistindex.css";

const WishlistSidebar = ({ wishlistItems, isOpen, onClose, onRemove }) => {
  const handleOverlayClick = (e) => {
    if (e.target.id === "wishlist-overlay") {
      onClose();
    }
  };

  const handleRemoveItem = (id) => {
    onRemove(id);
  };

  return (
    <div
      id="wishlist-overlay"
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "100vh" }}
      >
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Wishlist ({wishlistItems.length})
          </h2>
          <button onClick={onClose} className="text-xl text-white">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div
          className="p-4 overflow-y-auto h-[calc(100%-5rem)] custom-scrollbar"
          style={{ maxHeight: "calc(100vh - 5rem)" }}
        >
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div key={item.id} className="border-b py-4">
                <div className="flex items-center">
                  <Link
                    to={`/product/${item.sku}`}
                    className="mr-4"
                    onClick={onClose}
                  >
                    <img
                      src={item.image.url || ""}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </Link>
                  <div className="flex-grow">
                    <Link to={`/product/${item.sku}`} onClick={onClose}>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-700">
                      {item.short_description?.html ||
                        "No description available."}
                    </p>
                    <p className="text-xl font-bold">
                      ${item.price_range.minimum_price.regular_price.value}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition ml-4"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-700">Your wishlist is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistSidebar;
