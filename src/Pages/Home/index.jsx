import React from "react";
import ProductCard from "../../Componen/ProductCard";
import CategoryList from "../../Componen/CategoryList";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    products(filter: {}) {
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

const Home = ({ onAddToCart, onAddToWishlist, wishlistItems }) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const products = data.products.items;

  return (
    <div className="bg-gray-100 min-h-screen">
      <CategoryList />
      <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            isFavorited={wishlistItems.some((item) => item.id === product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
