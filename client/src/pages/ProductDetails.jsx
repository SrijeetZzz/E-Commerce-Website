import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [realtedProduct, setRelatedProduct] = useState([]);

  //get-product
  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/get-single-product/${params.slug}`
        );
        setProduct(data?.product);
        getSimilarProduct(data?.product._id, data?.product.category._id);
      } catch (error) {
        console.log(error);
      }
    };

    if (params.slug) {
      getProduct();
    }
  }, [params.slug]);
  useEffect(() => {
    if (product._id && product.category) {
      getSimilarProduct(product._id, product.category._id);
    }
  }, [product]);
  if (!product || !product.name) {
    return <div>Loading...</div>; // Or handle loading state as per your UI
  }

  //similar-product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="row container">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="img-fluid rounded-start "
            alt={product.name}
          />
        </div>
        <div className="col-md-6 text-center">
          <h1>Product Details</h1>
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>Price: {product.price}</h6>
          <h6>Category: {product.category.name}</h6>
          <button href="#" class="btn btn-secondary ms-1">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="row">
        <h1>Similar Products</h1>
        <div className="d-flex flex-wrap">
          {realtedProduct?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}</p>
                <p className="card-text">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
