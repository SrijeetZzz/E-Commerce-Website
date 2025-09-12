import React from "react";
import { useAuth } from "../../context/auth";
import UserMenu from "../../components/layout/UserMenu";

const UserDashboard = () => {
  const [auth] = useAuth();
  return (
    <>
      <div className="container-fluid m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{auth?.user.name}</h3>
              <h3>{auth?.user.email}</h3>
              <h3>{auth?.user.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
