import React, { useState, useEffect } from "react";
import {
  Card,
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
import {
  listarVacunas,
  registrarVacuna,
  actualizarVacuna,
  eliminarVacuna,
} from "../services/vacunaService";
import { listarAnimales } from "../services/animalService"; // 📌 Para obtener los animales

const Vacunaciones = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [animales, setAnimales] = useState([]); // 📌 Lista de animales para el select
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFormState = {
    idHembra: "",
    especie: "",
    raza: "",
    edad: "",
    tipoVacuna: "",
    dosisAdministrada: "",
    fechaProximaDosis: "",
    veterinario: "",
    observaciones: "",
    idAnimal: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editMode, setEditMode] = useState(false);
  const [vacunaId, setVacunaId] = useState(null);

  // 📌 Cargar las vacunas desde la blockchain al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vacunas = await listarVacunas();
        const listaAnimales = await listarAnimales();
        setVaccinations(vacunas);
        setAnimales(listaAnimales);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        setError("Error al cargar vacunaciones.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 📌 Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Manejar cambios en el `select` de animales
  const handleAnimalChange = (idAnimal) => {
    setFormData({ ...formData, idAnimal });
  };

  // 📌 Registrar una nueva vacuna
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await registrarVacuna(
        formData.idHembra,
        formData.especie,
        formData.raza,
        formData.edad,
        formData.tipoVacuna,
        formData.dosisAdministrada,
        new Date(formData.fechaProximaDosis).toISOString(), // 🔥 Convertimos a string compatible
        formData.veterinario,
        formData.observaciones,
        formData.idAnimal
      );
      alert("✅ Vacuna registrada con éxito");
      setVaccinations(await listarVacunas());
      resetForm();
    } catch (error) {
      alert("❌ Error al registrar la vacuna");
      console.error("Error:", error);
    }
  };

  // 📌 Cargar datos de una vacuna para edición
  const handleEdit = (vacuna) => {
    setEditMode(true);
    setVacunaId(vacuna.id);
    setFormData({ ...vacuna });
  };

  // 📌 Actualizar una vacuna existente
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await actualizarVacuna(
        vacunaId,
        formData.idHembra,
        formData.especie,
        formData.raza,
        formData.edad,
        formData.tipoVacuna,
        formData.dosisAdministrada,
        formData.fechaProximaDosis,
        formData.veterinario,
        formData.observaciones
      );
      alert("✅ Vacuna actualizada con éxito");
      setEditMode(false);
      setVacunaId(null);
      setVaccinations(await listarVacunas());
      resetForm();
    } catch (error) {
      alert("❌ Error al actualizar la vacuna");
      console.error("Error:", error);
    }
  };

  // 📌 Eliminar una vacuna
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta vacuna?")) {
      try {
        await eliminarVacuna(id);
        alert("✅ Vacuna eliminada con éxito");
        setVaccinations(await listarVacunas());
      } catch (error) {
        alert("❌ Error al eliminar la vacuna");
        console.error("Error:", error);
      }
    }
  };

  // 📌 Resetear el formulario
  const resetForm = () => {
    setFormData(initialFormState);
  };

  return (
    <Card>
      <CardBody className="space-y-4 bg-background">
        <Typography variant="h5">Registro de Vacunaciones</Typography>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* 📌 Formulario de Vacunación */}
        <form
          onSubmit={editMode ? handleUpdate : handleCreate}
          className="space-y-4"
        >
          <Input
            label="ID Hembra"
            name="idHembra"
            value={formData.idHembra}
            onChange={handleChange}
            required
          />
          <Input
            label="Especie"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            required
          />
          <Input
            label="Raza"
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
          />
          <Input
            label="Edad"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            required
          />
          <Input
            label="Tipo de Vacuna"
            name="tipoVacuna"
            value={formData.tipoVacuna}
            onChange={handleChange}
            required
          />
          <Input
            label="Dosis Administrada"
            name="dosisAdministrada"
            type="number"
            value={formData.dosisAdministrada}
            onChange={handleChange}
            min="0" // Evita números negativos en el input
            step="1" // 🔥 Solo permite números enteros
            required
          />

          <Input
            label="Fecha Próxima Dosis"
            name="fechaProximaDosis"
            type="date"
            value={formData.fechaProximaDosis}
            onChange={handleChange}
            required
          />
          <Input
            label="Veterinario"
            name="veterinario"
            value={formData.veterinario}
            onChange={handleChange}
            required
          />
          <Input
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
          />

          {/* 📌 Select de Animales */}
          <Select
            label="Seleccionar Animal"
            value={formData.idAnimal}
            onChange={handleAnimalChange}
          >
            {animales.map((animal) => (
              <Option key={animal.id} value={animal.id}>
                {animal.nombre} - ID: {animal.id}
              </Option>
            ))}
          </Select>

          <Button type="submit">
            {editMode ? "Actualizar Vacuna" : "Registrar Vacuna"}
          </Button>
        </form>

        {/* 📌 Lista de Vacunas */}
        <div className="mt-6">
          <Typography variant="h6">Lista de Vacunaciones</Typography>
          {vaccinations.map((vacuna) => (
            <div
              key={vacuna.id}
              className="flex items-center justify-between p-2 border-b"
            >
              <Typography>
                {vacuna.tipoVacuna} - {vacuna.veterinario}
              </Typography>
              <div className="flex gap-2">
                <IconButton onClick={() => handleEdit(vacuna)}>
                  <Tooltip content="Editar">
                    <PencilIcon className="w-5 h-5" />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => handleDelete(vacuna.id)}>
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
