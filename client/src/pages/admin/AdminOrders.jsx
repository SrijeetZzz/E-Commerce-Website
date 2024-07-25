
import React, { useState, useEffect } from 'react';
import Adminmenu from "../../components/layout/AdminMenu";
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAuth } from "../../context/auth";
import { Select } from 'antd';

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders", {
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
      await axios.put(`/api/v1/auth/order-status/${orderId}`, { status: value }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      getOrders(); // Reload orders after updating status
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <Adminmenu />
        </div>
        <div className="col-md-9">
          <h1 className='text-center'>All Orders</h1>
          {orders?.map((o, i) => (
            <div className="border shadow" key={o._id}>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Order</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>
                      <Select bordered={false} onChange={(value) => handleChange(o._id, value)} defaultValue={o?.status}>
                        {status.map((s, i) => (
                          <Option key={i} value={s}>{s}</Option>
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
              <div className="container">
                {o?.products?.map((p, i) => (
                  <div className="row mb-2 card flex-row" key={p._id}>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
