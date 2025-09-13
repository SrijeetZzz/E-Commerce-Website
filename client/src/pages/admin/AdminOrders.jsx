import React, { useState, useEffect } from "react";
import Adminmenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import AdminMenu from "../../components/layout/AdminMenu";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
       const API = process.env.REACT_APP_API_URL;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/v1/auth/all-orders`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${API}/api/v1/auth/order-status/${orderId}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      getOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row m-3">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-3">All Orders</h1>

            {orders?.map((o, i) => (
              <div className="border shadow p-3 mb-3" key={o._id}>
                {/* Order Table */}
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Order</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          defaultValue={o?.status}
                          onChange={(value) => handleChange(o._id, value)}
                        >
                          {status.map((s, idx) => (
                            <Option key={idx} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Products Grid */}
                <div className="row">
                  {o?.products?.map((p) => (
                    <div className="col-md-4 col-sm-6 col-12 mb-3" key={p._id}>
                      <div className="card h-100">
                        <img
                          src={`${API}/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          style={{ objectFit: "cover", height: "220px" }}
                        />
                        <div className="card-body">
                          <p className="mb-1">{p.name}</p>
                          <p className="mb-1">
                            {p.description.substring(0, 30)}...
                          </p>
                          <p className="mb-0">Price: ${p.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
