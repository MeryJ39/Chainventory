import React, { createContext, useState, useEffect } from "react";
import { validarUsuario } from "../services/usuarioService";

// 📌 Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Función para hacer login usando blockchain
  const login = async (username, password) => {
    setLoading(true);
    console.log("🔒 Validando usuario...");
    console.log("👤 Usuario:", username);
    const result = await validarUsuario(username, password);

    if (result.success) {
      setUser(result.usuario);
      localStorage.setItem("usuario", JSON.stringify(result.usuario)); // Guardar en localStorage
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, message: result.message };
    }
  };

  // 📌 Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUser(JSON.parse(usuarioGuardado));
    }
  }, []);

  // 📌 Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
