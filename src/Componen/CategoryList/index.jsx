import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faBoxOpen,
  faAppleAlt,
  faTshirt,
  faUtensils,
  faSeedling,
  faCoffee,
  faPaintBrush,
  faLeaf,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

const GET_CATEGORIES = gql`
  query GetCategories {
    categoryList {
      id
      name
      children {
        id
        name
        children {
          id
          name
        }
      }
    }
  }
`;

const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case "Ethiopian Goods":
      return faAppleAlt;
    case "Foods and Spices":
      return faUtensils;
    case "Cookies Coffee & Tea":
      return faCoffee;
    case "Spices":
      return faSeedling;
    case "Clothing":
      return faTshirt;
    case "Fragrance":
      return faLeaf;
    case "Crafts and Art":
      return faPaintBrush;
    case "Cosmetics":
      return faPalette;
    default:
      return faBoxOpen;
  }
};

const CategoryList = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (data) {
      const expandAll = (categories) => {
        let expanded = {};
        categories.forEach((category) => {
          expanded[category.id] = true;
          if (category.children) {
            expanded = { ...expanded, ...expandAll(category.children) };
          }
        });
        return expanded;
      };
      setExpandedCategories(expandAll(data.categoryList));
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const categories = data.categoryList;

  const renderCategories = (categories, isChild = false) => {
    return categories.map((category) => (
      <li
        key={category.id}
        className={`text-gray-700 hover:text-blue-700 transition-colors duration-300 ${
          isChild ? "ml-4" : ""
        }`}
      >
        <div className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-gray-100 transition-colors duration-300">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon
              icon={getCategoryIcon(category.name)}
              className="text-xl text-gray-500"
            />
            <NavLink
              to={`/category/${category.id}`}
              className={({ isActive }) =>
                isActive ? "font-bold text-blue-700" : "text-gray-700"
              }
            >
              {category.name}
            </NavLink>
          </div>
          {category.children && category.children.length > 0 && (
            <button
              onClick={() =>
                setExpandedCategories((prevState) => ({
                  ...prevState,
                  [category.id]: !prevState[category.id],
                }))
              }
              className="text-gray-500 hover:text-blue-700"
            >
              <FontAwesomeIcon
                icon={
                  expandedCategories[category.id]
                    ? faChevronDown
                    : faChevronRight
                }
              />
            </button>
          )}
        </div>
        {category.children &&
          category.children.length > 0 &&
          expandedCategories[category.id] && (
            <ul className="pl-6 border-l-2 border-gray-300 mt-2">
              {renderCategories(category.children, true)}
            </ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-xs overflow-y-auto h-[80vh]">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Categories</h2>
      <ul className="space-y-2">{renderCategories(categories)}</ul>
    </div>
  );
};

export default CategoryList;
