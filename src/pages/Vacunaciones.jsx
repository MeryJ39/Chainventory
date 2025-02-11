//Registro y seguimiento de vacunaciones del ganado.
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

const Vacunaciones = () => {
  const [vacunaciones, setVacunaciones] = useState([
    // Datos de ejemplo
    {
      id_vacunacion: "1",
      id_producto: "1", // Reemplaza con IDs de productos reales (ganado)
      fecha_vacunacion: "2024-07-27 09:00",
      tipo_vacuna: "FMD",
      dosis_administrada: 2.0,
      fecha_proxima_dosis: "2024-10-27",
      veterinario_responsable: "Dr. Juan Pérez",
      observaciones: "Vacunación exitosa",
    },
  ]);

  const [nuevaVacunacion, setNuevaVacunacion] = useState({
    id_producto: "",
    fecha_vacunacion: "",
    tipo_vacuna: "",
    dosis_administrada: "",
    fecha_proxima_dosis: "",
    veterinario_responsable: "",
    observaciones: "",
  });

  const handleInputChange = (e) => {
    setNuevaVacunacion({ ...nuevaVacunacion, [e.target.name]: e.target.value });
  };

  const agregarVacunacion = () => {
    setVacunaciones([...vacunaciones, nuevaVacunacion]);
    setNuevaVacunacion({
      // Limpia el formulario
      id_producto: "",
      fecha_vacunacion: "",
      tipo_vacuna: "",
      dosis_administrada: "",
      fecha_proxima_dosis: "",
      veterinario_responsable: "",
      observaciones: "",
    });
  };

  const eliminarVacunacion = (id) => {
    setVacunaciones(
      vacunaciones.filter((vacunacion) => vacunacion.id_vacunacion !== id)
    );
  };

  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Gestión de Vacunaciones
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Formulario para agregar vacunaciones */}
        <Typography variant="h5" color="blue" className="mb-4">
          Agregar Vacunación
        </Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Animal (Producto)"
            name="id_producto"
            value={nuevaVacunacion.id_producto}
            onChange={handleInputChange}
          >
            <Option value="1">Vaca Angus</Option>{" "}
            {/* Reemplaza con opciones de animales reales */}
            {/* ... más opciones de animales */}
          </Select>
          <Input
            type="datetime-local"
            label="Fecha de Vacunación"
            name="fecha_vacunacion"
            value={nuevaVacunacion.fecha_vacunacion}
            onChange={handleInputChange}
          />
          <Input
            label="Tipo de Vacuna"
            name="tipo_vacuna"
            value={nuevaVacunacion.tipo_vacuna}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            step="0.01" // Permite decimales
            label="Dosis Administrada"
            name="dosis_administrada"
            value={nuevaVacunacion.dosis_administrada}
            onChange={handleInputChange}
          />
          <Input
            type="date"
            label="Próxima Dosis"
            name="fecha_proxima_dosis"
            value={nuevaVacunacion.fecha_proxima_dosis}
            onChange={handleInputChange}
          />
          <Input
            label="Veterinario Responsable"
            name="veterinario_responsable"
            value={nuevaVacunacion.veterinario_responsable}
            onChange={handleInputChange}
          />
          <Input
            label="Observaciones"
            name="observaciones"
            value={nuevaVacunacion.observaciones}
            onChange={handleInputChange}
          />
        </div>
        <Button
          variant="gradient"
          color="blue"
          className="mt-4"
          onClick={agregarVacunacion}
        >
          Agregar
        </Button>

        {/* Tabla de vacunaciones */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300">ID</th>
                <th className="px-4 py-2 border border-gray-300">Animal</th>
                <th className="px-4 py-2 border border-gray-300">
                  Fecha Vacunación
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Tipo Vacuna
                </th>
                <th className="px-4 py-2 border border-gray-300">Dosis</th>
                <th className="px-4 py-2 border border-gray-300">
                  Próxima Dosis
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Veterinario
                </th>
                <th className="px-4 py-2 border border-gray-300">
                  Observaciones
                </th>
                <th className="px-4 py-2 border border-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunaciones.map((vacunacion) => (
                <tr key={vacunacion.id_vacunacion}>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.id_vacunacion}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.id_producto}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.fecha_vacunacion}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.tipo_vacuna}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.dosis_administrada}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.fecha_proxima_dosis}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.veterinario_responsable}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {vacunacion.observaciones}
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
                            eliminarVacunacion(vacunacion.id_vacunacion)
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

export default Vacunaciones;
