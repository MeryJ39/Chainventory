import React, { useState } from "react";
import useUsers from "../hooks/useUsers";

const Usuarios = () => {
  const { users, roles, loading, error, createUser, deleteUser } = useUsers();
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleCreate = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.password ||
      !newUser.role
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }
    await createUser(newUser);
    setNewUser({ username: "", email: "", password: "", role: "" });
  };

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-xl font-bold">Gestión de Usuarios</h2>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Lista de Usuarios */}
      <ul className="p-4 bg-white rounded shadow-md">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-2 border-b"
          >
            <span>
              {user.username} - {user.email} - {user.role?.name || "Sin rol"}
            </span>
            <button
              onClick={() => deleteUser(user._id)}
              className="px-2 py-1 text-white bg-red-500 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Formulario para agregar usuario */}
      <div className="p-4 mt-6 bg-white rounded shadow-md">
        <h3 className="text-lg font-semibold">Agregar Usuario</h3>

        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="w-full p-2 mt-2 border"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full p-2 mt-2 border"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 mt-2 border"
        />

        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full p-2 mt-2 border"
        >
          <option value="">Seleccionar Rol</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="px-4 py-2 mt-3 text-white bg-blue-500 rounded"
        >
          Crear Usuario
        </button>
      </div>
    </div>
  );
};

export default Usuarios;
