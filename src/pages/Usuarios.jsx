import React, { useState, useEffect } from "react";
import {
  listarUsuarios,
  registrarUsuario,
  eliminarUsuario,
} from "../services/usuarioService";

const Usuarios = () => {
  const [users, setUsers] = useState([]); // 📌 Lista de usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    rol: "usuario", // 📌 Rol por defecto
  });

  // 📌 Cargar usuarios desde la blockchain al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usuarios = await listarUsuarios();
        setUsers(usuarios);
      } catch (error) {
        console.error("❌ Error al listar usuarios:", error);
        setError("Error al obtener usuarios");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // 📌 Manejar creación de usuario
  const handleCreate = async () => {
    if (!newUser.username || !newUser.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      await registrarUsuario(newUser.username, newUser.password, newUser.rol);
      alert(`✅ Usuario ${newUser.username} registrado con éxito`);

      // 📌 Recargar la lista de usuarios
      const usuariosActualizados = await listarUsuarios();
      setUsers(usuariosActualizados);
      setNewUser({ username: "", password: "", rol: "usuario" });
    } catch (error) {
      console.error("❌ Error al registrar usuario:", error);
      alert("Error al registrar usuario, intenta de nuevo.");
    }
  };

  // 📌 Manejar eliminación de usuario
  const handleDelete = async (username) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${username}?`)) {
      try {
        await eliminarUsuario(username);
        alert(`✅ Usuario ${username} eliminado con éxito`);

        // 📌 Recargar la lista de usuarios
        const usuariosActualizados = await listarUsuarios();
        setUsers(usuariosActualizados);
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        alert("Error al eliminar usuario, intenta de nuevo.");
      }
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-xl font-bold">Gestión de Usuarios</h2>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Lista de Usuarios */}
      <ul className="p-4 rounded shadow-md bg-background">
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user.username}
              className="flex items-center justify-between p-2 border-b"
            >
              <span>
                {user.username} - {user.rol} -{" "}
                {user.activo ? "Activo" : "Desactivado"}
              </span>
              <button
                onClick={() => handleDelete(user.username)}
                className="px-2 py-1 text-white bg-red-500 rounded"
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No hay usuarios registrados.</p>
        )}
      </ul>

      {/* Formulario para agregar usuario */}
      <div className="p-4 mt-6 rounded shadow-md bg-background">
        <h3 className="text-lg font-semibold">Agregar Usuario</h3>

        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="w-full p-2 mt-2 border bg-background"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 mt-2 border bg-background"
        />
        <select
          value={newUser.rol}
          onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
          className="w-full p-2 mt-2 border bg-background"
        >
          <option value="usuario">Usuario</option>
          <option value="administrador">Administrador</option>
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
