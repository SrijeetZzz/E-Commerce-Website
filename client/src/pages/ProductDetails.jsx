import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/cart";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [cart, setCart] = useCart();
    const API = process.env.REACT_APP_API_URL;

  // Fetch product
  useEffect(() => {
    if (params.slug) getProduct();
  }, [params.slug]);

  const getProduct = async () => {
    try {
      setLoadingProduct(true);
      const { data } = await axios.get(
        `/${API}/api/v1/product/get-single-product/${params.slug}`
      );
      setProduct(data?.product);
      setLoadingProduct(false);
      if (data?.product._id && data?.product.category?._id) {
        getSimilarProduct(data?.product._id, data?.product.category._id);
      }
    } catch (error) {
      console.log(error);
      setLoadingProduct(false);
    }
  };

  // Fetch similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      setLoadingSimilar(true);
      const { data } = await axios.get(
        `/${API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products || []);
      setLoadingSimilar(false);
    } catch (error) {
      console.log(error);
      setLoadingSimilar(false);
    }
  };

  // Shuffle array function
  const getRandomProducts = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomSimilar = getRandomProducts(relatedProduct, 5);

  // Add product to cart
  const addToCart = (p) => {
    const updatedCart = [...cart, p];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart");
  };

  return (
    <div className="container-fluid mt-5">
      {/* Product Details Row */}
      <div className="row justify-content-center mb-5">
        {loadingProduct ? (
          <div className="d-flex justify-content-center w-100 mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="col-lg-5 col-md-6 mb-3 d-flex justify-content-center">
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                className="img-fluid rounded"
                alt={product.name}
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="col-lg-5 col-md-6 d-flex flex-column justify-content-center align-items-center text-center">
              <h1 className="mb-3">Product Details</h1>
              <h5>Name: {product.name}</h5>
              <h6>Description: {product.description}</h6>
              <h6>Price: ${product.price}</h6>
              <h6>Category: {product.category.name}</h6>
              <button
                className="btn btn-secondary mt-3"
                style={{ width: "200px" }}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>

      {/* Similar Products */}
      <div className="similar-products-section">
        <h2 className="text-center mb-4">Similar Products</h2>
        {loadingSimilar ? (
          <div className="d-flex justify-content-center w-100 mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : relatedProduct.length === 0 ? (
          <p className="text-center">No similar products found.</p>
        ) : (
          <div className="row justify-content-center">
            {randomSimilar.map((p) => (
              <div
                key={p._id}
                className="col-lg-2 col-md-4 col-sm-6 mb-3 d-flex align-items-stretch"
              >
                <div className="card similar-card w-100">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${p.slug}`)}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text text-truncate">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text text-success">${p.price}</p>
                    <button
                      className="btn btn-secondary mt-2"
                      onClick={() => addToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
