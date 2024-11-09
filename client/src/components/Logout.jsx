// src/components/Logout.js

import React, { useEffect, useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null;
}

export default Logout;
