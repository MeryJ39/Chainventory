//Gestión de usuarios
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
  Tooltip,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([
    // Datos de ejemplo
    {
      id_usuario: "1",
      nombre_usuario: "admin",
      rol_id: "1", // Reemplaza con IDs de roles reales
    },
  ]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_usuario: "",
    contrasena: "", // No guardar la contraseña directamente, usar hash
    rol_id: "",
  });

  const handleInputChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const agregarUsuario = () => {
    // Aquí deberías encriptar la contraseña antes de guardarla.
    // ... lógica para encriptar la contraseña ...

    setUsuarios([...usuarios, nuevoUsuario]); // Usar spread operator para añadir nuevo usuario
    setNuevoUsuario({
      // Limpia el formulario
      nombre_usuario: "",
      contrasena: "",
      rol_id: "",
    });
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
  };

  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Gestión de Usuarios
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Formulario para agregar usuarios */}
        <Typography variant="h5" color="blue" className="mb-4">
          Agregar Usuario
        </Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Nombre de Usuario"
            name="nombre_usuario"
            value={nuevoUsuario.nombre_usuario}
            onChange={handleInputChange}
          />
          <Input
            type="password" // Para contraseñas
            label="Contraseña"
            name="contrasena"
            value={nuevoUsuario.contrasena}
            onChange={handleInputChange}
          />
          <Select
            label="Rol"
            name="rol_id"
            value={nuevoUsuario.rol_id}
            onChange={handleInputChange}
          >
            <Option value="1">Administrador</Option>{" "}
            {/* Reemplaza con opciones de roles reales */}
            <Option value="2">Editor</Option>
            {/* ... más opciones de roles */}
          </Select>
        </div>
        <Button
          variant="gradient"
          color="blue"
          className="mt-4"
          onClick={agregarUsuario}
        >
          Agregar
        </Button>

        {/* Tabla de usuarios */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">ID</th>
                <th className="px-4 py-2 border border-gray-300">Nombre</th>
                <th className="px-4 py-2 border border-gray-300">Rol</th>
                <th className="px-4 py-2 border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td className="px-4 py-2 border border-gray-300">
                    {usuario.id_usuario}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {usuario.nombre_usuario}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {usuario.rol_id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip content="Editar">
                        <IconButton variant="text" color="blue">
                          <PencilIcon className="w-5 h-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => eliminarUsuario(usuario.id_usuario)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default Usuarios;
