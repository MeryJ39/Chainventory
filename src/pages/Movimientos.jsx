//Registro de entradas y salidas del inventario.
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

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([
    // Datos de ejemplo
    {
      id_movimiento: "1",
      id_producto: "1", // Reemplaza con IDs de productos reales
      fecha_hora: "2024-07-26 10:00",
      tipo_movimiento: "entrada",
      cantidad: 10,
      usuario: "1", // Reemplaza con IDs de usuarios reales
      observaciones: "Entrega de 10 vacas",
    },
  ]);

  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    id_producto: "",
    fecha_hora: "",
    tipo_movimiento: "",
    cantidad: "",
    usuario: "",
    observaciones: "",
  });

  const handleInputChange = (e) => {
    setNuevoMovimiento({ ...nuevoMovimiento, [e.target.name]: e.target.value });
  };

  const agregarMovimiento = () => {
    setMovimientos([...movimientos, nuevoMovimiento]);
    setNuevoMovimiento({
      // Limpia el formulario
      id_producto: "",
      fecha_hora: "",
      tipo_movimiento: "",
      cantidad: "",
      usuario: "",
      observaciones: "",
    });
  };

  const eliminarMovimiento = (id) => {
    setMovimientos(
      movimientos.filter((movimiento) => movimiento.id_movimiento !== id)
    );
  };

  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Gestión de Movimientos
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Formulario para agregar movimientos */}
        <Typography variant="h5" color="blue" className="mb-4">
          Agregar Movimiento
        </Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Producto"
            name="id_producto"
            value={nuevoMovimiento.id_producto}
            onChange={handleInputChange}
          >
            <Option value="1">Vaca Angus</Option>{" "}
            {/* Reemplaza con opciones de productos reales */}
            <Option value="2">Filtro de aire</Option>
          </Select>
          <Input
            type="datetime-local" // Para fecha y hora
            label="Fecha y Hora"
            name="fecha_hora"
            value={nuevoMovimiento.fecha_hora}
            onChange={handleInputChange}
          />
          <Select
            label="Tipo de Movimiento"
            name="tipo_movimiento"
            value={nuevoMovimiento.tipo_movimiento}
            onChange={handleInputChange}
          >
            <Option value="entrada">Entrada</Option>
            <Option value="salida">Salida</Option>
          </Select>
          <Input
            type="number"
            label="Cantidad"
            name="cantidad"
            value={nuevoMovimiento.cantidad}
            onChange={handleInputChange}
          />
          <Select
            label="Usuario"
            name="usuario"
            value={nuevoMovimiento.usuario}
            onChange={handleInputChange}
          >
            <Option value="1">Usuario 1</Option>{" "}
            {/* Reemplaza con opciones de usuarios reales */}
            <Option value="2">Usuario 2</Option>
          </Select>
          <Input
            label="Observaciones"
            name="observaciones"
            value={nuevoMovimiento.observaciones}
            onChange={handleInputChange}
          />
        </div>
        <Button
          variant="gradient"
          color="blue"
          className="mt-4"
          onClick={agregarMovimiento}
        >
          Agregar
        </Button>

        {/* Tabla de movimientos */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">ID</th>
                <th className="px-4 py-2 border border-gray-300">Producto</th>
                <th className="px-4 py-2 border border-gray-300">
                  Fecha y Hora
                </th>
                <th className="px-4 py-2 border border-gray-300">Tipo</th>
                <th className="px-4 py-2 border border-gray-300">Cantidad</th>
                <th className="px-4 py-2 border border-gray-300">Usuario</th>
                <th className="px-4 py-2 border border-gray-300">
                  Observaciones
                </th>
                <th className="px-4 py-2 border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id_movimiento}>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.id_movimiento}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.id_producto}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.fecha_hora}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.tipo_movimiento}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.cantidad}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.usuario}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {movimiento.observaciones}
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
                          onClick={() =>
                            eliminarMovimiento(movimiento.id_movimiento)
                          }
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

export default Movimientos;
