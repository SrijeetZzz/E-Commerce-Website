import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/CategoryProductStyle.css"

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) {
      getProductsByCategory();
    }
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      console.log("API response data:", data); // Log the response to check its structure
      setProducts(data?.product || []); // Ensure 'product' field is used
      setCategory(data?.category || {});
    } catch (error) {
      console.log("Error fetching products by category:", error);
    }
  };

  return (
    <div className="container mt-3 category">
      <h1 className="text-center">Category - {category?.name}</h1>
      <div className="row">
        <div className="col-md-12">
          {products.length === 0 ? (
            <p>No products found for this category.</p>
          ) : (
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <div key={p._id} className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}
                    </p>
                    <p className="card-text">${p.price}</p>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
