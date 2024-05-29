import React from "react";
import ProductCard from "../../Componen/ProductCard";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: String!) {
    categoryList(filters: { ids: { eq: $categoryId } }) {
      name
    }
    products(filter: { category_id: { eq: $categoryId } }) {
      items {
        id
        name
        sku
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

const Category = ({ onAddToCart, onAddToWishlist, wishlistItems }) => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const categoryName = data.categoryList[0]?.name;
  const products = data.products.items;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Category: {categoryName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
};

export default Category;
