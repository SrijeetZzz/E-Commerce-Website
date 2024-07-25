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
      let index = myCart.findIndex((item) => item._id == pid);
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
      const { data } = await axios.get("/api/v1/product/braintree/token");
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
        "/api/v1/product/braintree/payment",
        { nonce, cart },
        {
          headers: { Authorization: `Bearer ${auth.token}` }
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
    <div
      className="container "
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="row">
        <h1 className="text-center bg-light p-2">
          {`Hello ${auth.token && auth.user?.name}`}
        </h1>
        <h4 className="text-center">
          {cart?.length > 1
            ? `You have ${cart.length} items in your cart ${
                auth?.token ? "" : "please login to checkout"
              }`
            : "Your cart is empty"}
        </h4>
      </div>
      <div className="row">
        <div className="col-md-8">
          {cart?.map((p) => (
            <div className="row mb-2 card flex-row">
              <div className="col-md-4">
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
              </div>
              <div className="col-md-8">
                <p>{p.name}</p>
                <p>{p.description.substring(0, 30)}</p>
                <p>Price : ${p.price}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => removeCartItem(p._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4 text-center">
          <h2>Cart Summary</h2>
          <p>Total | Checkout | Payment</p>
          <hr />
          <h4>Total : {totalPrice()} </h4>
          {auth.user?.address ? (
            <div className="mb-3">
              <h4>Current Address</h4>
              <h5>{auth?.user?.address}</h5>
              <button
                className="btn btn-outline-warning"
                onClick={() => {
                  navigate("/dashboard/user/profile");
                }}
              >
                Update Address
              </button>
            </div>
          ) : (
            <div className="mb-3">
              {auth?.token ? (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    navigate("/dashboard/user/profile");
                  }}
                >
                  Update Address
                </button>
              ) : (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    navigate("/login", { state: "/cart" });
                  }}
                >
                  Please Login to checkout
                </button>
              )}
            </div>
          )}
          <div className="mt-2">
            {!clientToken || !cart.length ? (
              ""
            ) : (
              <>
                <DropIn
                  options={{
                    authorization: clientToken,
                  }}
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
    </div>
  );
};

export default CartPage;
