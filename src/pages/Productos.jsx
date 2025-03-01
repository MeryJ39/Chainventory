import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  listarProductos,
  registrarProducto,
  actualizarProductoInfo,
  eliminarProducto,
} from "../services/productoService"; // 🔥 Servicio de productos
import { listarAnimales } from "../services/animalService"; // 🔥 Servicio de animales

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [animales, setAnimales] = useState([]); // 🔥 Lista de animales
  const [loading, setLoading] = useState(true);
  const [nuevoProducto, setNuevoProducto] = useState({
    tipo: "",
    descripcion: "",
    especie: "",
    edad: "",
    raza: "",
    cantidad: "",
    movimiento: "",
    guia: "",
    autorizacion: "",
    destino: "",
    saldo: "",
    observaciones: "",
    idAnimal: "", // 🔥 Selección de animal
  });

  const [editProducto, setEditProducto] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 📌 Cargar productos y animales desde la blockchain
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listaProductos = await listarProductos();
        const listaAnimales = await listarAnimales();
        setProductos(listaProductos);
        setAnimales(listaAnimales);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 📌 Manejar cambios en los inputs
  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // 📌 Manejar selección de un animal
  const handleAnimalSelect = (idAnimal) => {
    setNuevoProducto({ ...nuevoProducto, idAnimal });
  };

  // 📌 Crear un nuevo producto
  const handleCreate = async () => {
    try {
      await registrarProducto(
        nuevoProducto.tipo,
        nuevoProducto.descripcion,
        nuevoProducto.especie,
        Number(nuevoProducto.edad),
        nuevoProducto.raza,
        Number(nuevoProducto.cantidad),
        nuevoProducto.movimiento,
        nuevoProducto.guia,
        nuevoProducto.autorizacion,
        nuevoProducto.destino,
        Number(nuevoProducto.saldo),
        nuevoProducto.observaciones,
        Number(nuevoProducto.idAnimal)
      );

      alert("✅ Producto registrado con éxito");
      setProductos(await listarProductos());
      setNuevoProducto({
        tipo: "",
        descripcion: "",
        especie: "",
        edad: "",
        raza: "",
        cantidad: "",
        movimiento: "",
        guia: "",
        autorizacion: "",
        destino: "",
        saldo: "",
        observaciones: "",
        idAnimal: "",
      });
    } catch (error) {
      alert("❌ Error al registrar el producto");
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-5 transition-colors delay-300 bg-background">
      <Typography variant="h4" className="mb-4">
        Gestión de Productos
      </Typography>

      {/* 📌 Formulario para agregar producto */}
      <Card className="mb-5 bg-background text-text">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Añadir Producto
          </Typography>

          <div className="grid grid-cols-3 gap-4">
            {Object.keys(nuevoProducto).map((key) =>
              key === "idAnimal" ? ( // 🔥 Si el campo es idAnimal, mostramos un <Select>
                <Select
                  key={key}
                  label="Seleccionar Animal"
                  value={String(nuevoProducto.idAnimal)} // 🔥 Convertimos a string
                  onChange={(idAnimal) => handleAnimalSelect(idAnimal)}
                  className="border border-gray-400 text-text"
                >
                  {animales.map((animal) => (
                    <Option key={animal.id} value={String(animal.id)}>
                      {" "}
                      {/* 🔥 Convertimos a string */}
                      {animal.nombre} (ID: {animal.id})
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input
                  key={key}
                  type="text"
                  label={key.replace("_", " ").toUpperCase()}
                  name={key}
                  value={nuevoProducto[key]}
                  onChange={handleChange}
                  className="border-text text-text"
                />
              )
            )}
          </div>

          <Button className="mt-4 bg-secondary" onClick={handleCreate}>
            Agregar Producto
          </Button>
        </CardBody>
      </Card>

      {/* 📌 Lista de productos */}
      <Card className="bg-background text-text">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Lista de Productos
          </Typography>

          {loading ? (
            <Typography>Cargando productos...</Typography>
          ) : productos.length === 0 ? (
            <Typography>No hay productos disponibles</Typography>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="flex justify-between p-3 border-b"
                >
                  <Typography>
                    {producto.id} - {producto.tipo}
                  </Typography>
                  <div className="flex gap-2">
                    <IconButton
                      size="sm"
                      onClick={() => setEditProducto(producto)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 📌 Modal de edición */}
      <Dialog
        open={isEditDialogOpen}
        handler={() => setIsEditDialogOpen(false)}
        className="p-4"
      >
        <DialogHeader className="relative">
          <Typography variant="h5">Editar Producto</Typography>
          <IconButton
            size="sm"
            variant="text"
            className="absolute right-3.5 top-3.5"
            onClick={() => setIsEditDialogOpen(false)}
          >
            <XMarkIcon className="w-4 h-4" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="pb-6 space-y-4">
          {editProducto ? (
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(editProducto).map((key) => (
                <Input
                  key={key}
                  name={key}
                  value={editProducto[key]}
                  onChange={(e) =>
                    setEditProducto({
                      ...editProducto,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <Typography className="text-gray-500">Cargando datos...</Typography>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={() =>
              actualizarProductoInfo(
                editProducto.id,
                editProducto.tipo,
                editProducto.descripcion,
                editProducto.especie,
                Number(editProducto.edad),
                editProducto.raza
              )
            }
          >
            Actualizar Producto
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Productos;
