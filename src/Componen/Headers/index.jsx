import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";

const Header = ({
  onCartClick,
  onWishlistClick,
  cartItemsCount,
  wishlistItemsCount,
}) => {
  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">
        <Link to="/">E-Commerce</Link>
      </h1>
      <nav className="flex items-center">
        <button
          onClick={onWishlistClick}
          className="relative mr-4 hover:underline flex items-center text-white"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={`mr-2 text-2xl ${
              wishlistItemsCount > 0 ? "text-red-500" : "text-white"
            }`}
          />
          Wishlist
        </button>
        <button
          onClick={onCartClick}
          className="relative hover:underline flex items-center text-white"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2 text-2xl" />

          {cartItemsCount > 0 && (
            <span className="absolute -top-3 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {cartItemsCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
