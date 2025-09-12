import React from "react";
import AdminMenu from "../../components/layout/AdminMenu";

const Users = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row m-3">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>All Users</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
