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
} from "../services/productoService";
import { listarAnimales } from "../services/animalService";

// eslint-disable-next-line react/prop-types
const Field = ({ label, name, value, onChange }) => (
  <Input
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    className="w-full border-text text-text"
  />
);

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [animales, setAnimales] = useState([]);
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
    idAnimal: "",
  });
  const [editProducto, setEditProducto] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [listaProductos, listaAnimales] = await Promise.all([
          listarProductos(),
          listarAnimales(),
        ]);
        setProductos(listaProductos);
        setAnimales(listaAnimales);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });

  const handleAnimalSelect = (idAnimal) =>
    setNuevoProducto({ ...nuevoProducto, idAnimal });

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

  const currentProducts = productos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  return (
    <div className="p-5 bg-background text-text">
      <Typography variant="h4" className="mb-4">
        Gestión de Productos
      </Typography>

      {/* ➕ FORMULARIO */}
      <Card className="p-4 mb-5 shadow-md bg-background">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Añadir Producto
          </Typography>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(nuevoProducto).map(([key, val]) =>
              //si la key es raza hacer un select
              key === "raza" ? (
                <Select
                  key={key}
                  label="Seleccionar Raza"
                  value={val}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, raza: e })
                  }
                >
                  <Option value="Angus">Angus</Option>
                  <Option value="Hereford">Hereford</Option>
                  <Option value="Brangus">Brangus</Option>
                  <Option value="Nelore">Nelore</Option>
                  <Option value="Simmental">Simmental</Option>
                  <Option value="Limousin">Limousin</Option>
                  <Option value="Charolais">Charolais</Option>
                  <Option value="Holstein">Holstein</Option>
                  <Option value="Jersey">Jersey</Option>
                  <Option value="Pardo Suizo">Pardo Suizo</Option>
                  <Option value="Gyr">Gyr</Option>
                  <Option value="Otro">Otro</Option>
                </Select>
              ) : key === "especie" ? (
                <Select
                  key={key}
                  label="Seleccionar Especie"
                  value={val}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, especie: e })
                  }
                >
                  <Option value="Bos_indicus">Bos indicus</Option>
                  <Option value="Bubalus_taurus">Bubalus taurus</Option>
                  <Option value="Hibrido">Hibrido</Option>
                </Select>
              ) : key === "tipo" ? (
                <Select
                  key={key}
                  label="Seleccionar Tipo"
                  value={val}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, tipo: e })
                  }
                >
                  <Option value="Entrada">Ganado de Carne</Option>
                  <Option value="Salida">Ganado de Leche</Option>
                  <Option value="Salida">Ganado de Reproductores</Option>
                  <Option value="Salida">Otros</Option>
                </Select>
              ) : key === "movimiento" ? (
                <Select
                  key={key}
                  label="Seleccionar Movimiento"
                  value={val}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, movimiento: e })
                  }
                >
                  <Option value="Entrada">Entrada</Option>
                  <Option value="Traslado">Traslado</Option>
                  <Option value="Salida">Salida</Option>
                  <Option value="Venta">Venta</Option>
                  <Option value="Compra">Compra</Option>
                  <Option value="Otros">Otros</Option>
                </Select>
              ) : key === "idAnimal" ? (
                <Select
                  key={key}
                  label="Seleccionar Animal"
                  value={val}
                  onChange={handleAnimalSelect}
                >
                  {animales.map((a) => (
                    <Option key={a.id} value={String(a.id)}>
                      {a.nombre} (ID: {a.id})
                    </Option>
                  ))}
                </Select>
              ) : (
                <Field
                  key={key}
                  label={key.replace("_", " ").toUpperCase()}
                  name={key}
                  value={val}
                  onChange={handleChange}
                />
              )
            )}
          </div>
          <div className="flex justify-center sm:justify-start">
            <Button
              className="w-full mt-4 sm:w-auto bg-secondary"
              onClick={handleCreate}
            >
              Agregar Producto
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 📋 LISTA DE PRODUCTOS */}
      <Card className="p-4 shadow-md bg-background">
        <CardBody>
          <Typography variant="h5" className="mb-4">
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
            <>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      {[
                        "ID",
                        "Descripción",
                        "Tipo",
                        "Destino",
                        "Cantidad",
                        "Saldo",
                        "Acciones",
                      ].map((h) => (
                        <th key={h} className="p-2 border">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{prod.id}</td>
                        <td className="p-2 border">{prod.descripcion}</td>
                        <td className="p-2 border">{prod.tipo}</td>
                        <td className="p-2 border">{prod.destino}</td>
                        <td className="p-2 border">{prod.cantidad}</td>
                        <td className="p-2 border">{prod.saldo} Bs</td>
                        <td className="flex justify-center gap-2 p-2 border">
                          <button
                            className="p-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => {
                              setEditProducto(prod);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={() => eliminarProducto(prod.id)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ◀ Anterior
                </Button>
                <span>
                  {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente ▶
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* ✏️ MODAL DE EDICIÓN */}
      <Dialog
        open={isEditDialogOpen}
        handler={() => setIsEditDialogOpen(false)}
      >
        <DialogHeader className="bg-gray-100 dark:bg-gray-700">
          <Typography variant="h5">Editar Producto</Typography>
          <button
            onClick={() => setIsEditDialogOpen(false)}
            className="absolute right-4 top-4"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </DialogHeader>
        <DialogBody className="bg-white dark:bg-gray-800">
          {editProducto ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(editProducto).map(([key, val]) => (
                <Field
                  key={key}
                  label={key.replace("_", " ").toUpperCase()}
                  name={key}
                  value={val}
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
            <Typography className="text-center text-gray-500">
              Cargando datos...
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-3 bg-gray-100 dark:bg-gray-700">
          <Button variant="text" onClick={() => setIsEditDialogOpen(false)}>
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
          >
            Actualizar Producto
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Productos;
