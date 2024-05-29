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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const product = data.products.items[0];
  console.log(product, "uniq name");
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
      <div className="p-4 bg-gray-100 min-h-screen">Product not found</div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-4">
        <div className="flex flex-col md:flex-row">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover mb-4 md:mb-0"
          />
          <div className="md:ml-4">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div
              className="text-lg mb-4 text-gray-700"
              // dangerouslySetInnerHTML={{
              //   __html: product.short_description.html,
              // }}
            >
              ${product.short_description?.html}
            </div>
            <p className="text-xl font-bold mb-4">
              ${product.price_range?.minimum_price.regular_price?.value}
            </p>
            <div className="flex items-center">
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
                {addedToCart ? "Added" : "Add to Cart"}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="bg-gray-300 text-black py-2 px-4 rounded ml-2 hover:bg-gray-400 transition-colors duration-300 flex items-center"
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
