import React, { useEffect } from "react";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useState } from "react";


const UserProfile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name || "");
      setEmail(auth.user.email || "");
      setPhone(auth.user.phone || "");
      setAddress(auth.user.address || "");
    }
  }, [auth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle profile update logic here
  };

  return (
    <div className="container-fluid">
      <div className="row m-3">
        {/* Sidebar */}
        <div className="col-md-3">
          <UserMenu />
        </div>

        {/* Profile Form */}
        <div className="col-md-9">
          <div className="register">
            <h1 className="text-center mb-4">USER PROFILE</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {" "}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Email"
                  disabled
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  placeholder="Phone No"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  placeholder="Address"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Password"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                UPDATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
