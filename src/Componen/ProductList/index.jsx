import React from "react";
import { useParams } from "react-router-dom";

const products = {
  Electronics: ["TV", "Radio"],
  Books: ["Novel", "Science"],
  Clothing: ["Shirts", "Pants"],
};

function ProductList() {
  let { category } = useParams();
  console.log(category);
  let categoryProducts = products[category] || [];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{category}</h2>
      <ul>
        {categoryProducts.map((product, index) => (
          <li
            key={index}
            className="p-3 bg-brand-light rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
            style={{ animation: "fade-in 0.5s" }}
          >
            {product}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
