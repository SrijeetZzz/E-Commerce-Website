import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import "../styles/Categories.css";

const Categories = () => {
  const categories = useCategory();

  return (
    <div className="container-fluid mt-3">
      <h2 className="text-center mb-4">Explore Categories</h2>
      <div className="categories-row d-flex flex-wrap justify-content-center">
        {categories.map((c) => (
          <div key={c._id} className="category-wrapper">
            <div className="category-card text-center p-4 rounded">
              <h4 className="mb-3">{c.name}</h4>
              <Link to={`/category/${c.slug}`} className="btn btn-primary">
                Browse {c.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
