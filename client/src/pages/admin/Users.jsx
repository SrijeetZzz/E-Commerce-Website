// import React from "react";
// import AdminMenu from "../../components/layout/AdminMenu";

// const Users = () => {
//   return (
//     <>
//       <div className="container-fluid">
//         <div className="row m-3">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <h1>All Users</h1>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Users;
import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
const Users = () => {
  const [users, setUsers] = useState([]);


  // fetch users from API
  const getUsers = async () => {
    try {
      const authData = localStorage.getItem("auth");
      if (!authData) return toast.error("Authentication data not found");

      let token = JSON.parse(authData).token;
      const { data } = await axios.get("/api/v1/auth/users",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // adjust base URL if needed
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row m-3">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>All Users</h1>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
