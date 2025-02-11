import { useState, useEffect, useContext } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { AuthContext } from "../context/authContext";

const useUsers = () => {
  const { token } = useContext(AuthContext);
  const { register } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Registrar un nuevo usuario
  const createUser = async (username, email, password, roleName) => {
    await register(username, email, password, roleName);
    fetchUsers(); // Actualizar la lista de usuarios
  };

  // Obtener usuario por ID
  const getUserById = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al obtener usuario");
    }
  };

  // Actualizar usuario
  const updateUser = async (userId, userData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refrescar lista de usuarios
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refrescar lista de usuarios
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
  };
};

export default useUsers;
