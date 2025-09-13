import React from "react";
import { useSearch } from "../context/search";
import { toast } from "react-toastify";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="text-center">
        <h1>Search Results</h1>
        <h6>
          {values?.results.length < 1
            ? "No product found"
            : `Found ${values?.results.length}`}
        </h6>
        <div className="category d-flex flex-wrap mt-4 justify-content-center">
          {values?.results.map((p) => (
            <div
              key={p._id}
              className="col-lg-3 col-md-4 col-sm-6 mb-3 d-flex align-items-stretch"
              style={{ maxWidth: "18rem" }}
            >
              <div className="card similar-card w-100">
                <img
                  src={`${API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}</p>
                  <p className="card-text text-success">${p.price}</p>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary flex-fill"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
