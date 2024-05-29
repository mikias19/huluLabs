import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isFavorited,
}) => {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1000); // Reset after 1 second
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };
  console.log(product, "mikias");
  return (
    <div className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.sku}`}>
        <img
          src={product.image?.url}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
      </Link>
      <h2 className="text-lg font-bold mb-2 text-gray-800">{product.name}</h2>
      <div className="text-sm mb-4 text-gray-600">
        $
        {product.short_description.html
          ? product.short_description.html
          : "No description available."}
      </div>
      <p className="text-xl font-bold mb-4 text-gray-800">
        ${product.price_range.minimum_price.regular_price.value}
      </p>
      <div className="flex space-x-2">
        <button
          onClick={handleAddToCart}
          className={`py-2 px-4 rounded transition-colors duration-300 flex items-center ${
            addedToCart
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FontAwesomeIcon
            icon={addedToCart ? faCheck : faShoppingCart}
            className="mr-2"
          />
          {addedToCart ? "Added" : "Add to Cart  ss"}
        </button>
        <button
          onClick={handleAddToWishlist}
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-300 flex items-center"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={`mr-2 ${isFavorited ? "text-red-500" : "text-black"}`}
          />
          {isFavorited ? "Favorited" : "Favorite"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
