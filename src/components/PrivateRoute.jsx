import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
   return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
