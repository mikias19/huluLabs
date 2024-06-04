import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "../../Queries/searchQueries";

const Header = ({
  onCartClick,
  onWishlistClick,
  cartItemsCount,
  wishlistItemsCount,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { loading, data } = useQuery(SEARCH_PRODUCTS, {
    variables: { search: searchTerm },
    skip: !searchTerm,
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-extrabold whitespace-nowrap tracking-wide">
          <Link
            to="/"
            className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Hulu Labs
          </Link>
        </h1>
      </div>
      <div className="relative flex items-center w-full max-w-lg mx-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          className="w-full p-3 rounded-l-md focus:outline-none text-black"
          placeholder="Search for products..."
        />
        <button className="bg-yellow-500 p-4 rounded-r-md hover:bg-yellow-600 transition-colors flex items-center justify-center">
          <FontAwesomeIcon icon={faSearch} className="text-md" />
        </button>
        {showResults && (
          <div className="absolute top-full left-0 w-full bg-white text-black rounded-b-md shadow-lg mt-1 z-10 max-h-60 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="text-blue-600 text-2xl"
                />
              </div>
            ) : (
              data?.products?.items.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.sku}`}
                  className="block p-4 hover:bg-gray-200 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-center">
                    <img
                      src={product.image.url}
                      alt={product.name}
                      className="w-10 h-10 mr-4 object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-gray-600 text-sm">
                        ${product.price_range.minimum_price.regular_price.value}{" "}
                        {
                          product.price_range.minimum_price.regular_price
                            .currency
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
      <nav className="flex items-center space-x-6">
        <button
          onClick={onWishlistClick}
          className="relative flex items-center text-white"
        >
          <FontAwesomeIcon icon={faHeart} className="text-3xl" />
          {wishlistItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {wishlistItemsCount}
            </span>
          )}
        </button>
        <button
          onClick={onCartClick}
          className="relative flex items-center text-white"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="text-3xl" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartItemsCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
