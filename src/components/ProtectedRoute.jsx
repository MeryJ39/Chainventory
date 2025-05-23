import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Si no hay usuario, redirigir a login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    console.log("🚫 Acceso denegado: el usuario no tiene el rol requerido");
    console.log("Rol del usuario:", user.rol);
    // Si el usuario no tiene el rol requerido, redirigir a una página no autorizada o al dashboard
    return <Navigate to="/dashboard/animales" replace />;
    // O puedes crear una página de "No autorizado":
    // return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
