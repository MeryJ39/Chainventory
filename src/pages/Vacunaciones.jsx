//Registro y seguimiento de vacunaciones del ganado.
import React, { useState, useEffect } from "react";
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
import useVaccinations from "../hooks/useVaccinations";

const Vacunaciones = () => {
  const {
    vaccinations,
    loading,
    error,
    fetchVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
  } = useVaccinations();

  const [newVaccination, setNewVaccination] = useState({
    id_vacuna: "",
    fecha_registro: "",
    id_hembra: "",
    especie: "",
    raza: "",
    edad: "",
    tipo_vacuna: "",
    dosis_administrada: "",
    fecha_proxima_dosis: "",
    veterinario: "",
    observaciones: "",
    id_animal: "",
  });

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleChange = (e) => {
    setNewVaccination({ ...newVaccination, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addVaccination(newVaccination);
    setNewVaccination({
      id_vacuna: "",
      fecha_registro: "",
      id_hembra: "",
      especie: "",
      raza: "",
      edad: "",
      tipo_vacuna: "",
      dosis_administrada: "",
      fecha_proxima_dosis: "",
      veterinario: "",
      observaciones: "",
      id_animal: "",
    });
  };

  return (
    <Card>
      <CardBody className="space-y-4 bg-background">
        <Typography variant="h5">Registro de Vacunaciones</Typography>
        {loading && <p>Cargando...</p>}
        {error && <p>Error: {error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ID Vacuna"
            name="id_vacuna"
            value={newVaccination.id_vacuna}
            onChange={handleChange}
            required
          />
          <Input
            label="Fecha Registro"
            name="fecha_registro"
            type="date"
            value={newVaccination.fecha_registro}
            onChange={handleChange}
            required
          />
          <Input
            label="ID Hembra"
            name="id_hembra"
            value={newVaccination.id_hembra}
            onChange={handleChange}
            required
          />
          <Input
            label="Especie"
            name="especie"
            value={newVaccination.especie}
            onChange={handleChange}
            required
          />
          <Input
            label="Raza"
            name="raza"
            value={newVaccination.raza}
            onChange={handleChange}
            required
          />
          <Input
            label="Edad"
            name="edad"
            type="number"
            value={newVaccination.edad}
            onChange={handleChange}
            required
          />
          <Input
            label="Tipo de Vacuna"
            name="tipo_vacuna"
            value={newVaccination.tipo_vacuna}
            onChange={handleChange}
            required
          />
          <Input
            label="Dosis Administrada"
            name="dosis_administrada"
            type="number"
            step="0.01"
            value={newVaccination.dosis_administrada}
            onChange={handleChange}
            required
          />
          <Input
            label="Fecha Próxima Dosis"
            name="fecha_proxima_dosis"
            type="date"
            value={newVaccination.fecha_proxima_dosis}
            onChange={handleChange}
            required
          />
          <Input
            label="Veterinario"
            name="veterinario"
            value={newVaccination.veterinario}
            onChange={handleChange}
            required
          />
          <Input
            label="Observaciones"
            name="observaciones"
            value={newVaccination.observaciones}
            onChange={handleChange}
          />
          <Input
            label="ID Animal"
            name="id_animal"
            value={newVaccination.id_animal}
            onChange={handleChange}
            required
          />
          <Button type="submit">Registrar Vacuna</Button>
        </form>
        <div className="mt-6">
          <Typography variant="h6">Lista de Vacunaciones</Typography>
          {vaccinations.map((vacuna) => (
            <div
              key={vacuna.id_vacuna}
              className="flex items-center justify-between p-2 border-b"
            >
              <Typography>
                {vacuna.tipo_vacuna} - {vacuna.veterinario}
              </Typography>
              <div className="flex gap-2">
                <IconButton
                  onClick={() =>
                    updateVaccination(vacuna.id_vacuna, newVaccination)
                  }
                >
                  <Tooltip content="Editar">
                    <PencilIcon className="w-5 h-5" />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => deleteVaccination(vacuna.id_vacuna)}>
                  <Tooltip content="Eliminar">
                    <TrashIcon className="w-5 h-5" />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Vacunaciones;
