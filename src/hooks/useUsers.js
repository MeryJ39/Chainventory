import { useState, useEffect } from "react";

const API_USERS = "http://localhost:5000/api/users";
const API_ROLES = "http://localhost:5000/api/roles";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_USERS);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todos los roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(API_ROLES);
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Crear un usuario
  const createUser = async (user) => {
    try {
      const response = await fetch(API_USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Error al crear usuario");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Actualizar un usuario
  const updateUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error("Error al actualizar usuario");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar un usuario
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return { users, roles, loading, error, createUser, updateUser, deleteUser };
};

export default useUsers;
