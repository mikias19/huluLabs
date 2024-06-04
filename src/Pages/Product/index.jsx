import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: String!) {
    products(filter: { sku: { eq: $id } }) {
      items {
        id
        sku
        name
        image {
          url
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        short_description {
          html
        }
      }
    }
  }
`;

const Product = ({ onAddToCart, onAddToWishlist, wishlistItems }) => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id },
  });
  const [addedToCart, setAddedToCart] = useState(false);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error :(</p>;

  const product = data.products.items[0];

  const handleAddToCart = () => {
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1000); // Reset after 1 second
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const isFavorited = wishlistItems.some((item) => item.id === product.id);

  if (!product) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover mb-4 md:mb-0 rounded-lg transition-transform duration-300 transform hover:scale-105"
          />
          <div className="md:ml-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {product.name}
            </h2>
            <div className="text-lg mb-4 text-gray-700">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.short_description?.html,
                }}
              />
            </div>
            <p className="text-2xl font-bold mb-4 text-gray-800">
              ${product.price_range?.minimum_price.regular_price?.value}
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-6 rounded-lg transition-colors duration-300 flex items-center ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                <FontAwesomeIcon
                  icon={addedToCart ? faCheck : faShoppingCart}
                  className="mr-2"
                />
                {addedToCart ? "Added" : "Add to Cart"}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors duration-300 flex items-center"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`mr-2 ${
                    isFavorited ? "text-red-500" : "text-black"
                  }`}
                />
                {isFavorited ? "Favorited" : "Favorite"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
