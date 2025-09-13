import React, { useState, useEffect } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${API}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${API}/api/v1/product/braintree/payment`,
        { nonce, cart },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setLoading(false);

      if (data.success) {
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/dashboard/user/orders");
        toast.success("Payment successful");
      } else {
        console.error("Payment failed:", data.message || "Unknown error");
        toast.error(data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment error");
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid cart-page">
      {/* Row 1 */}
      <div className="row w-100 mt-3">
        <div className="col-12 text-center">
          <h1>{`Hello ${auth.token && auth.user?.name}`}</h1>
          <p>
            {cart?.length > 0
              ? `You have ${cart.length} items in your cart ${
                  auth?.token ? "" : "please login to checkout"
                }`
              : "Your cart is empty"}
          </p>
        </div>
      </div>

      {/* Row 2 - Items & Summary */}
      <div className="row mt-4 w-100">
        {/* Cart Items */}
        <div className="col-md-8">
          <div className="col-md-12">
            <div className="category d-flex flex-wrap justify-content-center">
              {cart?.map((p) => (
                <div
                  key={p._id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-3 d-flex align-items-stretch"
                  style={{ maxWidth: "16rem" }}
                >
                  <div className="card similar-card w-100">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        {p.description.substring(0, 40)}
                      </p>
                      <p className="card-text text-success">${p.price}</p>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => removeCartItem(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-md-4 mt-3">
          <div className="cart-summary card p-3 w-100">
            <h4 className="text-center">Cart Summary</h4>
            <table className="table table-borderless text-start">
              <tbody>
                <tr>
                  <td>Total Items</td>
                  <td>{cart?.length}</td>
                </tr>
                <tr>
                  <td>Total Price</td>
                  <td>{totalPrice()}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <div className="text-center">
              {auth.user?.address ? (
                <div>
                  <h5>Shipping Address</h5>
                  <p>{auth?.user?.address}</p>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div>
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => navigate("/login", { state: "/cart" })}
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 - Payment */}
      <div className="row mt-4 w-80">
        <div className="col-12 text-center">
          {!clientToken || !cart.length ? null : (
            <>
              <DropIn
                options={{ authorization: clientToken }}
                onInstance={(instance) => setInstance(instance)}
              />
              <button
                className="btn btn-primary"
                onClick={handlePayment}
                disabled={!instance || loading}
              >
                {loading ? "Processing..." : "Make Payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
