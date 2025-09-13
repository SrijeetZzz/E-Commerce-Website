import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-toastify";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
    const API = process.env.REACT_APP_API_URL;

  //handleform

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const { data } = await axios.post(
        `/${API}/api/v1/category/create-category`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.success) {
        toast.success(`${data.name} is created`);
        getAllCategory();
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in input form");
    }
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/${API}/api/v1/category/get-category`);
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  //update category

  const handleUpdate = async (e) => {
    e.preventDefault();

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
      const { data } = await axios.put(
        `/${API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //delete category

  const handleDelete = async (pId) => {
    try {
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

      const { data } = await axios.delete(
        `/${API}/api/v1/category/delete-category/${pId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(`Category is deleted`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
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
            <h1>Manage Category</h1>

            {/* Category Form */}
            <div className="p-3 w-50 mx-auto">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>

            {/* Category Table */}
            <div className="w-100 overflow-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">First</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Category Modal */}
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCategory;
