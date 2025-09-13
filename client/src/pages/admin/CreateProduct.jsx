import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
    const API = process.env.REACT_APP_API_URL;
  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/${API}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //product function
  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("LocalStorage content:", localStorage);
    // Retrieve the auth data from localStorage
    const authData = localStorage.getItem("auth");
    if (!authData) return toast.error("Authentication data not found");

    let token;
    try {
      token = JSON.parse(authData).token;
    } catch (error) {
      return toast.error("Failed to parse authentication data");
    }

    if (!token) return toast.error("Authentication token not found");

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo); // Assuming photo is a File object
      productData.append("category", category);

      const { data } = await axios.post(
        `/${API}/api/v1/product/create-product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );

      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products"); // Redirect to products dashboard
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
     
      <div className="container-fluid">
        <div className="row m-3">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <h1>Create Product</h1>

            <div className="m-1 w-75 mx-auto">
              {/* Category Select */}
              <div className="mb-3 w-100">
                <Select
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                  onChange={(value) => setCategory(value)}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Upload Photo */}
              <div className="mb-3 w-25">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Preview Photo */}
              {photo && (
                <div className="mb-3 text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}

              {/* Product Name */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* Shipping Select */}
              <div className="mb-3 w-100">
                <Select
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                  onChange={(value) => setShipping(value)}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              {/* Create Product Button */}
              <div className="mb-3 text-center">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
