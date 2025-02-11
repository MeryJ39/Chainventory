import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const useAuth = () => {
  const { setUser, setToken, logout } = useContext(AuthContext);

  // Función para registrar un nuevo usuario
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );
      console.log(response.data.message); // Mensaje de éxito
    } catch (error) {
      console.error("Error al registrar usuario", error);
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      setToken(token); // Guardamos el token en el contexto
      localStorage.setItem("token", token); // Guardamos el token en el localStorage

      // Obtener el perfil del usuario
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(userResponse.data); // Almacenamos los datos del usuario en el contexto
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  };

  return {
    register,
    login,
    logout,
  };
};

export default useAuth;
