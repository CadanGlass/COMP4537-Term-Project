// src/components/PrivateRoute.js

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

function PrivateRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
