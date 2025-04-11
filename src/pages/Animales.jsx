import { useState, useEffect } from "react";
import {
  listarAnimales,
  registrarAnimal,
  actualizarAnimal,
  retirarAnimal,
  cambiarCategoria,
  obtenerAnimal,
} from "../services/animalService";
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Opciones para selects
const CATEGORIAS = ["Ternero", "Novillo", "Vaquillona", "Vaca", "Toro"];
const ESTATUS_OPCIONES = ["Activo", "Vendido", "Muerto", "Enfermo"];

export default function Animales() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    idHembra: "",
    nombre: "",
    ganadera: "",
    fechaNacimiento: "",
    edad: "",
    categoriaIngreso: "",
    categoriaActual: "",
    estatus: "Activo",
  });
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [animalDetail, setAnimalDetail] = useState(null);
  const [categoriaNueva, setCategoriaNueva] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const lista = await listarAnimales();
        setAnimals(lista);
      } catch (error) {
        toast.error("Error al cargar animales: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setNewAnimal({ ...newAnimal, [field]: date.getTime() / 1000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAnimal) {
        await actualizarAnimal(
          editingAnimal.id,
          newAnimal.nombre,
          newAnimal.ganadera,
          newAnimal.edad,
          newAnimal.estatus
        );
        toast.success("Animal actualizado con éxito");
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
        toast.success("Animal registrado con éxito");
      }

      const listaActualizada = await listarAnimales();
      setAnimals(listaActualizada);
      resetForm();
    } catch (error) {
      toast.error("Error al procesar la solicitud: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewAnimal({
      idHembra: "",
      nombre: "",
      ganadera: "",
      fechaNacimiento: "",
      edad: "",
      categoriaIngreso: "",
      categoriaActual: "",
      estatus: "Activo",
    });
    setEditingAnimal(null);
  };

  const handleEdit = (animal) => {
    setNewAnimal({
      ...animal,
      fechaNacimiento: animal.fechaNacimiento || "",
    });
    setEditingAnimal(animal);
  };

  const handleDeleteClick = (animal) => {
    setAnimalToDelete(animal);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await retirarAnimal(animalToDelete.id, "Animal retirado por gestión");
      const listaActualizada = await listarAnimales();
      setAnimals(listaActualizada);
      toast.success("Animal retirado con éxito");
    } catch (error) {
      toast.error("Error al retirar el animal: " + error.message);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const detalle = await obtenerAnimal(id);
      setAnimalDetail(detalle);
      setOpenDetailDialog(true);
    } catch (error) {
      toast.error("Error al obtener detalles del animal: " + error.message);
    }
  };

  const handleChangeCategory = async (id) => {
    if (!categoriaNueva) {
      toast.warn("Selecciona una categoría primero");
      return;
    }

    setLoading(true);
    try {
      await cambiarCategoria(id, categoriaNueva);
      const listaActualizada = await listarAnimales();
      setAnimals(listaActualizada);
      toast.success("Categoría actualizada con éxito");
      setCategoriaNueva("");
    } catch (error) {
      toast.error("Error al cambiar categoría: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Función para calcular la edad en meses
  const calcularEdad = () => {
    if (!newAnimal.fechaNacimiento) {
      toast.warn("Primero selecciona una fecha de nacimiento");
      return;
    }

    const fechaNac = new Date(newAnimal.fechaNacimiento * 1000);
    const ahora = new Date();

    // Validar que la fecha no sea futura
    if (fechaNac > ahora) {
      toast.error("La fecha de nacimiento no puede ser futura");
      return;
    }

    // Calcular diferencia en meses
    const diffMeses =
      (ahora.getFullYear() - fechaNac.getFullYear()) * 12 +
      (ahora.getMonth() - fechaNac.getMonth());

    // Ajustar por días si es necesario
    const ajusteDias = ahora.getDate() < fechaNac.getDate() ? -1 : 0;
    const edadMeses = diffMeses + ajusteDias;

    // Validar que la edad sea positiva
    if (edadMeses <= 0) {
      toast.error("La fecha de nacimiento debe ser en el pasado");
      return;
    }

    setNewAnimal({ ...newAnimal, edad: edadMeses.toString() });
    toast.success("Edad calculada correctamente");
  };

  // Campo de edad con botón de cálculo
  const renderEdadField = () => (
    <div className="w-full">
      <Typography
        variant="small"
        className="mb-1 font-medium text-[var(--primary)]"
      >
        Edad (meses)
      </Typography>
      <div className="relative flex items-center">
        <Input
          name="edad"
          type="number"
          placeholder="Edad en meses"
          value={newAnimal.edad}
          onChange={handleChange}
          required
          min="1"
          className="text-[var(--text)] flex-auto"
        />
        <Button
          type="button"
          size="sm"
          onClick={calcularEdad}
          className="ml-2 flex-none text-xs w-24 text-background bg-[var(--primary)]"
          disabled={!newAnimal.fechaNacimiento}
        >
          Calcular
        </Button>
      </div>
      {!newAnimal.fechaNacimiento && (
        <Typography variant="small" className="mt-1 text-xs text-gray-600">
          Ingresa fecha de nacimiento para calcular
        </Typography>
      )}
    </div>
  );

  const generarIdUnico = () => {
    // Prefijo para IDs generados automáticamente (puedes personalizarlo)
    const prefijo = "MACHO-";

    // Generar un número aleatorio o usar timestamp
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    return `${prefijo}${timestamp}${randomNum}`;
  };

  const renderIdHembraField = () => (
    <div className="w-full">
      <Typography
        variant="small"
        className="mb-1 font-medium text-[var(--primary)]"
      >
        ID Animal {editingAnimal ? "(No editable)" : ""}
      </Typography>
      <div className="relative flex items-center">
        <Input
          name="idHembra"
          placeholder="ID del animal"
          value={newAnimal.idHembra}
          onChange={handleChange}
          required
          disabled={!!editingAnimal}
          className="text-[var(--text)] flex-auto"
        />
        {!editingAnimal && (
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const nuevoId = generarIdUnico();
              setNewAnimal({ ...newAnimal, idHembra: nuevoId });
              toast.success("ID generado automáticamente");
            }}
            className="ml-2 w-28 text-background flex-none bg-[var(--primary)] "
          >
            Generar ID
          </Button>
        )}
      </div>
      <Typography variant="small" className="mt-1 text-xs text-gray-600">
        {editingAnimal
          ? "El ID no se puede modificar en edición"
          : "Ingresa manualmente o genera automáticamente"}
      </Typography>
    </div>
  );

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold text-[var(--text)]">
        Gestión de Animales
      </h1>

      {/* 🔹 Formulario de Registro/Edición */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 p-6 mb-8 rounded-lg shadow-lg bg-[var(--background)] md:grid-cols-2 lg:grid-cols-3"
      >
        {renderIdHembraField()}

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Nombre
          </Typography>
          <Input
            name="nombre"
            placeholder="Nombre del animal"
            value={newAnimal.nombre}
            onChange={handleChange}
            required
            className="text-[var(--text)]"
          />
        </div>

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Ganadera
          </Typography>
          <Input
            name="ganadera"
            placeholder="Número de ganadera"
            value={newAnimal.ganadera}
            onChange={handleChange}
            required
            className="text-[var(--text)]"
          />
        </div>

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Fecha de Nacimiento
          </Typography>
          <DatePicker
            selected={
              newAnimal.fechaNacimiento
                ? new Date(newAnimal.fechaNacimiento * 1000)
                : null
            }
            onChange={(date) => handleDateChange(date, "fechaNacimiento")}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded bg-[var(--background)]"
            placeholderText="Seleccionar fecha"
            required={!editingAnimal}
            disabled={!!editingAnimal}
          />
        </div>

        {renderEdadField()}

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Categoría de Ingreso
          </Typography>
          <Select
            name="categoriaIngreso"
            value={newAnimal.categoriaIngreso}
            onChange={(value) =>
              setNewAnimal({ ...newAnimal, categoriaIngreso: value })
            }
            disabled={!!editingAnimal}
            className="text-[var(--text)]"
          >
            {CATEGORIAS.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Categoría Actual
          </Typography>
          <Select
            name="categoriaActual"
            value={newAnimal.categoriaActual}
            onChange={(value) =>
              setNewAnimal({ ...newAnimal, categoriaActual: value })
            }
            className="text-[var(--text)]"
          >
            {CATEGORIAS.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full">
          <Typography
            variant="small"
            className="mb-1 font-medium text-[var(--primary)]"
          >
            Estatus
          </Typography>
          <Select
            name="estatus"
            value={newAnimal.estatus}
            onChange={(value) => setNewAnimal({ ...newAnimal, estatus: value })}
            className="text-[var(--text)]"
          >
            {ESTATUS_OPCIONES.map((est) => (
              <Option key={est} value={est}>
                {est}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end lg:col-span-3">
          <Button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-background transition rounded-lg bg-[var(--primary)] hover:brightness-90"
          >
            {loading
              ? "Procesando..."
              : editingAnimal
              ? "Actualizar"
              : "Agregar"}
          </Button>
          {editingAnimal && (
            <Button
              variant="outlined"
              onClick={resetForm}
              className="px-5 py-2 ml-3 text-[var(--text)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-text"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {/* 🔹 Lista de Animales */}
      {loading && animals.length === 0 ? (
        <div className="flex justify-center">
          <Typography variant="h5">Cargando animales...</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((animal) => (
            <Card
              key={animal.id}
              className="border rounded-lg shadow-md bg-[var(--background)] transition-transform hover:scale-[1.02] overflow-visible"
            >
              <CardBody className="p-6">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-[var(--text)]">
                    {animal.nombre}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      animal.estatus === "Activo"
                        ? "bg-green-100 text-green-800"
                        : animal.estatus === "Enfermo"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {animal.estatus}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-[var(--primary)]">
                    <span className="font-semibold">ID:</span> {animal.idHembra}
                  </p>
                  <p className="text-[var(--primary)]">
                    <span className="font-semibold">Ganadera:</span>{" "}
                    {animal.ganadera}
                  </p>
                  <p className="text-[var(--primary)]">
                    <span className="font-semibold">Edad:</span> {animal.edad}{" "}
                    meses
                  </p>
                  <p className="text-[var(--primary)]">
                    <span className="font-semibold">Categoría:</span>{" "}
                    {animal.categoriaActual}
                  </p>
                  <p className="text-[var(--primary)]">
                    <span className="font-semibold">Ingreso:</span>{" "}
                    {formatDate(animal.fechaIngreso)}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    size="sm"
                    variant="outlined"
                    className="px-3 py-1 text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                    onClick={() => handleViewDetails(animal.id)}
                  >
                    👁️ Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    className="px-3 py-1 text-[var(--secondary)] border-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white"
                    onClick={() => handleEdit(animal)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    size="sm"
                    className="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    onClick={() => handleDeleteClick(animal)}
                  >
                    ❌ Retirar
                  </Button>
                </div>

                <div className="flex gap-2 mt-3">
                  <Select
                    size="sm"
                    label="Cambiar categoría"
                    value={categoriaNueva}
                    onChange={(value) => setCategoriaNueva(value)}
                    className="text-xs"
                  >
                    {CATEGORIAS.map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    size="sm"
                    className="px-2 py-1 text-xs"
                    onClick={() => handleChangeCategory(animal.id)}
                  >
                    Actualizar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* 🔹 Diálogo de Confirmación para Eliminar */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirmar Retiro</DialogHeader>
        <DialogBody>
          ¿Estás seguro de que deseas retirar al animal {animalToDelete?.nombre}{" "}
          (ID: {animalToDelete?.idHembra})?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Retiro"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 🔹 Diálogo de Detalles */}
      <Dialog
        open={openDetailDialog}
        handler={() => setOpenDetailDialog(false)}
        size="lg"
      >
        <DialogHeader>Detalles del Animal</DialogHeader>
        <DialogBody>
          {animalDetail && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p>
                  <span className="font-semibold">ID:</span>{" "}
                  {animalDetail.idHembra}
                </p>
                <p>
                  <span className="font-semibold">Nombre:</span>{" "}
                  {animalDetail.nombre}
                </p>
                <p>
                  <span className="font-semibold">Ganadera:</span>{" "}
                  {animalDetail.ganadera}
                </p>
                <p>
                  <span className="font-semibold">Estatus:</span>{" "}
                  {animalDetail.estatus}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Fecha Nacimiento:</span>{" "}
                  {formatDate(animalDetail.fechaNacimiento)}
                </p>
                <p>
                  <span className="font-semibold">Edad:</span>{" "}
                  {animalDetail.edad} meses
                </p>
                <p>
                  <span className="font-semibold">Categoría Ingreso:</span>{" "}
                  {animalDetail.categoriaIngreso}
                </p>
                <p>
                  <span className="font-semibold">Categoría Actual:</span>{" "}
                  {animalDetail.categoriaActual}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Fecha Ingreso:</span>{" "}
                  {formatDate(animalDetail.fechaIngreso)}
                </p>
                {animalDetail.fechaRetiro && (
                  <p>
                    <span className="font-semibold">Fecha Retiro:</span>{" "}
                    {formatDate(animalDetail.fechaRetiro)}
                  </p>
                )}
              </div>
              <div>
                {animalDetail.causaMortalidad && (
                  <p>
                    <span className="font-semibold">Causa Retiro:</span>{" "}
                    {animalDetail.causaMortalidad}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpenDetailDialog(false)}>Cerrar</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
