import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductStyle.css"

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const params = useParams();
  const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (params?.slug) {
      getProductsByCategory();
    }
  }, [params?.slug]);

  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.product || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.log("Error fetching products by category:", error);
    }
  };

  return (
    <div className="container-fluid category">
      <h1 className="text-center mb-4">Category - {category?.name}</h1>
      {products.length === 0 ? (
        <p className="text-center">No products found for this category.</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div
              key={p._id}
              className="col-lg-3 col-md-4 col-sm-6 mb-3 d-flex align-items-stretch"
            >
              <div className="card similar-card w-100">
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text text-success">${p.price}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-secondary flex-fill">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProduct;
