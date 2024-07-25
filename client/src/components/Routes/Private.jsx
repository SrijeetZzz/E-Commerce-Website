// import axios from "axios";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/auth";
// import { Outlet } from "react-router-dom";
// import Spinner from "../Spinner";

// export default function PrivateRoute() {
//   const [ok, setOk] = useState(false);
//   const [auth, setAuth] = useAuth();

//   useEffect(() => {
//     const authCheck = async (req,res) => {
//       res = await axios.get("/api/v1/auth/user-auth");
//       if (res.data.ok) {
//         setOk(true);
//       } else {
//         setOk(false);
//       }
//     };
//     if (auth?.token) authCheck();
//   }, [auth?.token]);
//   console.log(ok)

//   return ok ? <Outlet /> : <Spinner />;
// }
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth(); // No need to set auth here, just read it

  useEffect(() => {
    const authCheck = async () => {
      try {
        if (!auth?.token) {
          // No token available, redirect to login or handle accordingly
          setOk(false);
          return;
        }

        // Send token in the request headers
        const res = await axios.get("/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setOk(false); // Set ok to false in case of error
      }
    };

    authCheck();
  }, [auth?.token]);

  console.log(ok);

  return ok ? <Outlet /> : <Spinner path="" />;
}

