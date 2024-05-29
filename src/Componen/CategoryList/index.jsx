import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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

const CategoryList = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [expandedCategories, setExpandedCategories] = useState({});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const categories = data.categoryList;

  const toggleCategory = (id) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderCategories = (categories) => {
    return categories.map((category) => (
      <li
        key={category.id}
        className="text-gray-700 hover:text-blue-700 transition-colors duration-300"
      >
        <div className="flex items-center space-x-[2rem]">
          <NavLink
            to={`/category/${category.id}`}
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-700" : "text-gray-700"
            }
          >
            {category.name}
          </NavLink>
          {category.children && category.children.length > 0 && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="ml-2 text-gray-500 hover:text-blue-700"
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
            <ul className="pl-4 ml-2 border-l-2 border-gray-300">
              {renderCategories(category.children)}
            </ul>
          )}
      </li>
    ));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
      <ul className="space-y-2">{renderCategories(categories)}</ul>
    </div>
  );
};

export default CategoryList;
