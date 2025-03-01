import { useState, useEffect } from "react";
import {
  listarAnimales,
  registrarAnimal,
  actualizarAnimal,
  retirarAnimal,
} from "../services/animalService";
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Animales() {
  const [animals, setAnimals] = useState([]); // 📌 Lista de animales
  const [newAnimal, setNewAnimal] = useState({
    idHembra: "",
    nombre: "",
    ganadera: "",
    fechaNacimiento: "",
    edad: "",
    categoriaIngreso: "",
    categoriaActual: "",
    estatus: "",
  });
  const [editingAnimal, setEditingAnimal] = useState(null);

  // 📌 Cargar los animales desde la blockchain al montar el componente
  useEffect(() => {
    const fetchAnimals = async () => {
      const lista = await listarAnimales();
      setAnimals(lista);
    };
    fetchAnimals();
  }, []);

  // 📌 Manejar cambios en los inputs
  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  // 📌 Manejar cambios en las fechas
  const handleDateChange = (date, field) => {
    setNewAnimal({ ...newAnimal, [field]: date.getTime() / 1000 }); // Convertir a timestamp
  };

  // 📌 Registrar o actualizar un animal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAnimal) {
      await actualizarAnimal(
        editingAnimal.id,
        newAnimal.nombre,
        newAnimal.ganadera,
        newAnimal.edad,
        newAnimal.estatus
      );
    } else {
      await registrarAnimal(
        newAnimal.idHembra,
        newAnimal.nombre,
        newAnimal.ganadera,
        newAnimal.fechaNacimiento,
        newAnimal.edad,
        newAnimal.categoriaIngreso,
        newAnimal.categoriaActual,
        newAnimal.estatus
      );
    }

    // 📌 Recargar lista después de actualizar
    setAnimals(await listarAnimales());
    setNewAnimal({
      idHembra: "",
      nombre: "",
      ganadera: "",
      fechaNacimiento: "",
      edad: "",
      categoriaIngreso: "",
      categoriaActual: "",
      estatus: "",
    });
    setEditingAnimal(null);
  };

  // 📌 Cargar datos del animal para edición
  const handleEdit = (animal) => {
    setNewAnimal({ ...animal });
    setEditingAnimal(animal);
  };

  // 📌 Eliminar (retirar) un animal
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas retirar este animal?")) {
      await retirarAnimal(id, "Animal retirado por gestión");
      setAnimals(await listarAnimales());
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de Animales</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(newAnimal).map((key) => (
          <div key={key} className="w-96">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-1 font-medium"
            >
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}{" "}
              {/* Formato mejorado */}
            </Typography>
            {key.includes("fecha") ? (
              <DatePicker
                selected={
                  newAnimal[key] ? new Date(newAnimal[key] * 1000) : null
                }
                onChange={(date) => handleDateChange(date, key)}
                dateFormat="yyyy-MM-dd"
                className="p-2 border border-gray-400 rounded appearance-none w-96 bg-background"
                placeholderText="Seleccionar fecha"
              />
            ) : (
              <Input
                name={key}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={newAnimal[key]}
                onChange={handleChange}
                className="appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            )}
          </div>
        ))}
        <Button type="submit" className="col-span-2">
          {editingAnimal ? "Actualizar" : "Agregar"}
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => (
          <Card key={animal.id} className="relative">
            <CardBody className="p-4">
              <h2 className="text-lg font-semibold">{animal.nombre}</h2>
              <p className="text-gray-600">Ganadera: {animal.ganadera}</p>
              <p className="text-gray-600">Edad: {animal.edad}</p>
              <p className="text-gray-600">
                Categoría Actual: {animal.categoriaActual}
              </p>
              <p className="text-gray-600">Estatus: {animal.estatus}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => handleEdit(animal)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleDelete(animal.id)}
                >
                  Retirar
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
