import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAnimals } from "../hooks/useAnimals";

export default function Animales() {
  const { animals, addAnimal, updateAnimal, deleteAnimal } = useAnimals();
  const [newAnimal, setNewAnimal] = useState({
    id_hembra: "",
    nombre: "",
    ganadera: "",
    fecha_ingreso: "",
    fecha_nacimiento: "",
    edad: "",
    categoria_ingreso: "",
    categoria_actual: "",
    estatus: "",
    fecha_retiro: "",
    causa_mortalidad: "",
  });
  const [editingAnimal, setEditingAnimal] = useState(null);

  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setNewAnimal({ ...newAnimal, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAnimal) {
      await updateAnimal(editingAnimal._id, newAnimal);
    } else {
      await addAnimal(newAnimal);
    }
    setNewAnimal({
      id_hembra: "",
      nombre: "",
      ganadera: "",
      fecha_ingreso: "",
      fecha_nacimiento: "",
      edad: "",
      categoria_ingreso: "",
      categoria_actual: "",
      estatus: "",
      fecha_retiro: "",
      causa_mortalidad: "",
    });
    setEditingAnimal(null);
  };

  const handleEdit = (animal) => {
    setNewAnimal({ ...animal });
    setEditingAnimal(animal);
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
              {key.replace("_", " ").toUpperCase()}
            </Typography>
            {key.includes("fecha") ? (
              <DatePicker
                selected={newAnimal[key] ? new Date(newAnimal[key]) : null}
                onChange={(date) => handleDateChange(date, key)}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border border-gray-300 rounded appearance-none"
                placeholderText="Seleccionar fecha"
              />
            ) : (
              <Input
                name={key}
                placeholder={key.replace("_", " ")}
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
          <Card key={animal._id} className="relative">
            <CardBody className="p-4">
              <h2 className="text-lg font-semibold">{animal.nombre}</h2>
              <p className="text-gray-600">Ganadera: {animal.ganadera}</p>
              <p className="text-gray-600">Edad: {animal.edad}</p>
              <p className="text-gray-600">
                Categoría Actual: {animal.categoria_actual}
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
                  onClick={() => deleteAnimal(animal._id)}
                >
                  Eliminar
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
