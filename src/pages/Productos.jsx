import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
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
        console.log("Lista de productos:", listaProductos);
        setAnimales(listaAnimales);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cambia esto si quieres más filas por página

  // Calcular los productos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productos.slice(indexOfFirstItem, indexOfLastItem);

  // Función para cambiar de página
  const totalPages = Math.ceil(productos.length / itemsPerPage);
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    <div className="p-5 bg-background">
      <Typography variant="h4" className="mb-4">
        Gestión de Productos
      </Typography>

      {/* 📌 Formulario para agregar producto */}
      <Card className="p-4 mb-5 shadow-md bg-background text-text sm:p-6">
        <CardBody>
          <Typography variant="h5" className="mb-4 text-center sm:text-left">
            Añadir Producto
          </Typography>

          {/* 🔥 Grid responsive */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(nuevoProducto).map((key) =>
              key === "idAnimal" ? (
                <Select
                  key={key}
                  label="Seleccionar Animal"
                  value={String(nuevoProducto.idAnimal)}
                  onChange={(idAnimal) => handleAnimalSelect(idAnimal)}
                  className="w-full text-text"
                >
                  {animales.map((animal) => (
                    <Option key={animal.id} value={String(animal.id)}>
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
                  className="w-full border-text text-text"
                />
              )
            )}
          </div>

          {/* 🔥 Botón centrado en pantallas pequeñas */}
          <div className="flex justify-center sm:justify-start">
            <Button
              className="w-full mt-4 bg-secondary sm:w-auto"
              onClick={handleCreate}
            >
              Agregar Producto
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 📌 Lista de productos */}
      <Card className="p-4 shadow-md bg-background text-text">
        <CardBody>
          <Typography variant="h5" className="mb-4 text-center sm:text-left">
            Lista de Productos
          </Typography>

          {loading ? (
            <Typography className="text-center text-gray-500">
              Cargando productos...
            </Typography>
          ) : productos.length === 0 ? (
            <Typography className="text-center text-gray-500">
              No hay productos disponibles
            </Typography>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-collapse border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      ID
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Descripción
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Tipo
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Destino
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Cantidad
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Saldo
                    </th>
                    <th className="p-2 border border-gray-300 dark:border-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((producto) => (
                    <tr
                      key={producto.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.id}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.descripcion}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.tipo}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.destino}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.cantidad}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-600">
                        {producto.saldo} Bs
                      </td>
                      <td className="flex justify-center gap-2 p-2 border border-gray-300 dark:border-gray-600">
                        <button
                          className="p-1 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            setEditProducto(producto);
                            setIsEditDialogOpen(true); // Abrir el modal
                          }}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1 text-white transition bg-red-500 rounded-md hover:bg-red-600"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  className="px-3 py-1 text-gray-700 transition bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-400 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  ◀ Anterior
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  {currentPage} de {totalPages}
                </span>
                <button
                  className="px-3 py-1 text-gray-700 transition bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-400 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                >
                  Siguiente ▶
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      {/* 📌 Modal de edición */}
      <Dialog
        open={isEditDialogOpen}
        handler={() => setIsEditDialogOpen(false)}
        className=" animate-fadeIn"
      >
        {/* 🟢 Header del Dialog */}
        <DialogHeader className="relative p-4 bg-gray-100 rounded-t-lg dark:bg-gray-700">
          <Typography
            variant="h5"
            className="text-lg font-semibold text-gray-900 ps-2 dark:text-gray-100"
          >
            Editar Producto
          </Typography>
          <button
            size="sm"
            className="absolute text-gray-500 right-4 top-4 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={() =>
              setIsEditDialogOpen(false) && console.log("Modal cerrado")
            }
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* 🟢 Cuerpo del Dialog */}
        <DialogBody className="px-6 pb-6 space-y-6 bg-white dark:bg-gray-800">
          {editProducto ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(editProducto).map((key) => (
                <Input
                  key={key}
                  name={key}
                  label={key.replace("_", " ").toUpperCase()}
                  value={editProducto[key]}
                  onChange={(e) =>
                    setEditProducto({
                      ...editProducto,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="text-gray-900 border-gray-300 dark:border-gray-600 dark:text-gray-100"
                />
              ))}
            </div>
          ) : (
            <Typography className="text-center text-gray-500">
              Cargando datos...
            </Typography>
          )}
        </DialogBody>

        {/* 🟢 Footer del Dialog */}
        <DialogFooter className="flex justify-end gap-3 p-4 bg-gray-100 rounded-b-lg dark:bg-gray-700">
          <Button
            variant="text"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsEditDialogOpen(false)}
          >
            Cancelar
          </Button>
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
            className="px-5 py-2 text-white transition rounded-lg bg-secondary hover:bg-secondary-dark"
          >
            Actualizar Producto
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Productos;
