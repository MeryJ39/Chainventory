import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
export const AuthContext = createContext(); // Exportación con nombre

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde el localStorage si hay un token
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("User fetched:", response.data);
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Función para manejar el logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setToken, setUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
