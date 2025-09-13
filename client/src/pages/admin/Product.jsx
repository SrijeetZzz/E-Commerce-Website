import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Spin } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); 
    const API = process.env.REACT_APP_API_URL;// loader state

  const limit = 12; // products per page

  // Get products
  const getAllProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API}/api/v1/product/get-product?page=${pageNumber}&limit=${limit}`
      );
      setProducts(data.products);
      setPage(data.current_page);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    getAllProducts(newPage);
  };

  return (
    <div className="container-fluid">
      <div className="row m-3">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1 className="text-center mb-3">All Products List</h1>

          {/* Loader + Product Cards */}
          <Spin spinning={loading} tip="Loading Products...">
            <div className="d-flex flex-wrap justify-content-start">
              {products.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <div
                    className="card m-2"
                    style={{ width: "18rem", height: "26rem" }}
                  >
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      style={{ height: "20rem", objectFit: "cover" }}
                    />
                    <div
                      className="card-body d-flex flex-column justify-content-between"
                      style={{ height: "calc(100% - 20rem)" }}
                    >
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-truncate">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Spin>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-outline-primary mx-1 ${
                  page === i + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
