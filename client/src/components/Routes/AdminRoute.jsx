import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth(); 

  useEffect(() => {
    const authCheck = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          return;
        }
        const res = await axios.get("/api/v1/auth/admin-auth", {
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
        setOk(false);
      }
    };

    authCheck();
  }, [auth?.token]);


  return ok ? <Outlet /> : <Spinner path=""/>;
}

