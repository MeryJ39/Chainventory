import { useState, useEffect } from "react";
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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Spinner,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  listarVacunas,
  registrarVacuna,
  actualizarVacuna,
  eliminarVacuna,
  obtenerVacuna,
  listarVacunasPorAnimal,
} from "../services/vacunaService";
import { listarAnimales } from "../services/animalService";

const Vacunaciones = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [vacunaToAction, setVacunaToAction] = useState(null);
  const [activeTab, setActiveTab] = useState("todas");
  const [selectedAnimal, setSelectedAnimal] = useState("");

  const initialFormState = {
    idHembra: "",
    especie: "",
    raza: "",
    edad: "",
    tipoVacuna: "",
    dosisAdministrada: "",
    fechaProximaDosis: null,
    veterinario: "",
    observaciones: "",
    idAnimal: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editMode, setEditMode] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vacunas, listaAnimales] = await Promise.all([
          listarVacunas(),
          listarAnimales(),
        ]);
        setVaccinations(vacunas);
        setAnimales(listaAnimales);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al cargar datos");
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cargar vacunas por animal cuando cambia la selección
  useEffect(() => {
    if (selectedAnimal && activeTab === "por-animal") {
      const fetchVacunasPorAnimal = async () => {
        setLoading(true);
        try {
          const vacunas = await listarVacunasPorAnimal(selectedAnimal);
          setVaccinations(vacunas);
        } catch (error) {
          console.error("Error al obtener vacunas por animal:", error);
          toast.error("Error al cargar vacunas del animal");
        } finally {
          setLoading(false);
        }
      };
      fetchVacunasPorAnimal();
    }
  }, [selectedAnimal, activeTab]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar selección de animal
  const handleAnimalSelect = (idAnimal) => {
    const animal = animales.find((a) => a.id === idAnimal);
    if (animal) {
      setFormData({
        ...formData,
        idAnimal,
        idHembra: animal.idHembra,
        especie: animal.especie || "",
        raza: animal.raza || "",
        edad: animal.edad || "",
      });
    }
  };

  // Manejar fecha próxima dosis
  const handleDateChange = (date) => {
    setFormData({ ...formData, fechaProximaDosis: date });
  };

  // Registrar nueva vacuna
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.fechaProximaDosis) {
      toast.warn("Selecciona una fecha para la próxima dosis");
      return;
    }

    setLoading(true);
    try {
      await registrarVacuna(
        formData.idHembra,
        formData.especie,
        formData.raza,
        formData.edad,
        formData.tipoVacuna,
        formData.dosisAdministrada,
        formData.fechaProximaDosis,
        formData.veterinario,
        formData.observaciones,
        formData.idAnimal
      );
      toast.success("Vacuna registrada con éxito");

      const vacunasActualizadas = await listarVacunas();
      setVaccinations(vacunasActualizadas);
      resetForm();
    } catch (error) {
      console.error("Error al registrar vacuna:", error);
      toast.error("Error al registrar vacuna");
    } finally {
      setLoading(false);
    }
  };

  // Cargar vacuna para edición
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const vacuna = await obtenerVacuna(id);
      setFormData({
        ...vacuna,
        fechaProximaDosis: new Date(vacuna.fechaProximaDosis * 1000),
      });
      setVacunaToAction(vacuna);
      setEditMode(true);
    } catch (error) {
      console.error("Error al obtener vacuna:", error);
      toast.error("Error al cargar vacuna para edición");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar vacuna
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.fechaProximaDosis) {
      toast.warn("Selecciona una fecha para la próxima dosis");
      return;
    }

    setLoading(true);
    try {
      await actualizarVacuna(
        vacunaToAction.id,
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
      toast.success("Vacuna actualizada con éxito");

      const vacunasActualizadas = await listarVacunas();
      setVaccinations(vacunasActualizadas);
      resetForm();
      setEditMode(false);
      setVacunaToAction(null);
    } catch (error) {
      console.error("Error al actualizar vacuna:", error);
      toast.error("Error al actualizar vacuna");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar vacuna
  const handleDelete = async () => {
    if (!vacunaToAction) return;

    setLoading(true);
    try {
      await eliminarVacuna(vacunaToAction.id);
      toast.success("Vacuna eliminada con éxito");

      const vacunasActualizadas = await listarVacunas();
      setVaccinations(vacunasActualizadas);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar vacuna:", error);
      toast.error("Error al eliminar vacuna");
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData(initialFormState);
    setEditMode(false);
    setVacunaToAction(null);
  };

  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Typography variant="h2" className="mb-6 text-3xl font-bold">
        Gestión de Vacunaciones
      </Typography>

      {/* Tabs para filtrar vacunas */}
      <Tabs value={activeTab} className="mb-6">
        <TabsHeader>
          <Tab value="todas" onClick={() => setActiveTab("todas")}>
            Todas las Vacunas
          </Tab>
          <Tab value="por-animal" onClick={() => setActiveTab("por-animal")}>
            Por Animal
          </Tab>
        </TabsHeader>
      </Tabs>

      {/* Selector de animal cuando está en la pestaña por-animal */}
      {activeTab === "por-animal" && (
        <div className="mb-6">
          <Select
            label="Seleccionar Animal"
            value={selectedAnimal}
            onChange={(value) => setSelectedAnimal(value)}
          >
            {animales.map((animal) => (
              <Option key={animal.id} value={animal.id}>
                {animal.nombre} (ID: {animal.idHembra})
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* Formulario de Vacunación */}
      <div className="mb-6 bg-background">
        <CardBody>
          <Typography variant="h4" className="mb-4">
            {editMode ? "Editar Vacuna" : "Nueva Vacuna"}
          </Typography>

          <form
            onSubmit={editMode ? handleUpdate : handleCreate}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Animal
              </Typography>
              <Select
                className=""
                value={formData.idAnimal}
                onChange={handleAnimalSelect}
                disabled={editMode}
              >
                {animales.map((animal) => (
                  <Option key={animal.id} value={animal.id}>
                    {animal.nombre} (ID: {animal.idHembra})
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                ID Hembra
              </Typography>

              <Input
                name="idHembra"
                value={formData.idHembra}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Especie
              </Typography>
              <Input
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Raza
              </Typography>
              <Input
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Edad (meses)
              </Typography>
              <Input
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Tipo de Vacuna
              </Typography>
              <Input
                name="tipoVacuna"
                value={formData.tipoVacuna}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Dosis Administrada(ml)
              </Typography>
              <Input
                name="dosisAdministrada"
                type="number"
                value={formData.dosisAdministrada}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Fecha Próxima Dosis
              </Typography>
              <DatePicker
                selected={formData.fechaProximaDosis}
                onChange={handleDateChange}
                minDate={new Date()}
                className="w-full p-2 border rounded bg-background"
                placeholderText="Seleccionar fecha"
                required
              />
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Veterinario
              </Typography>
              <Input
                name="veterinario"
                value={formData.veterinario}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Observaciones
              </Typography>
              <Input
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 md:col-span-2 lg:col-span-3">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Spinner className="w-5 h-5" />
                ) : editMode ? (
                  "Actualizar"
                ) : (
                  "Registrar"
                )}
              </Button>
              {editMode && (
                <Button variant="outlined" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </div>

      {/* Lista de Vacunas */}
      <Card className="mb-6 bg-background">
        <CardBody>
          <Typography variant="h4" className="mb-4 text-text">
            Registros de Vacunación
          </Typography>

          {loading ? (
            <div className="flex justify-center">
              <Spinner className="w-8 h-8" />
            </div>
          ) : vaccinations.length === 0 ? (
            <Typography className="text-center text-gray-500">
              No hay vacunaciones registradas
            </Typography>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {vaccinations.map((vacuna) => (
                <Card
                  key={vacuna.id}
                  className="border rounded-lg bg-background"
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Typography variant="h5" className="font-semibold">
                          {vacuna.tipoVacuna}
                        </Typography>
                        <Typography className="text-sm text-gray-600">
                          Animal: {vacuna.idHembra} | Veterinario:{" "}
                          {vacuna.veterinario}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <Chip
                            value={`Próxima dosis: ${formatDate(
                              vacuna.fechaProximaDosis
                            )}`}
                            icon={<CalendarIcon className="w-4 h-4" />}
                            className="text-xs"
                          />
                          <Chip
                            value={vacuna.activa ? "Activa" : "Inactiva"}
                            color={vacuna.activa ? "green" : "red"}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Tooltip content="Ver detalles">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setVacunaToAction(vacuna);
                              setOpenDetailDialog(true);
                            }}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Editar">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleEdit(vacuna.id)}
                          >
                            <PencilIcon className="w-5 h-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => {
                              setVacunaToAction(vacuna);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Diálogo de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirmar Eliminación</DialogHeader>
        <DialogBody>
          ¿Estás seguro que deseas{" "}
          {vacunaToAction?.activa ? "desactivar" : "reactivar"} la vacuna de
          tipo <span className="font-bold">{vacunaToAction?.tipoVacuna}</span>{" "}
          aplicada al animal{" "}
          <span className="font-bold">{vacunaToAction?.idHembra}</span>?
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
            color={vacunaToAction?.activa ? "red" : "green"}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <Spinner className="w-5 h-5" />
            ) : vacunaToAction?.activa ? (
              "Desactivar"
            ) : (
              "Reactivar"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Diálogo de Detalles */}
      <Dialog
        open={openDetailDialog}
        handler={() => setOpenDetailDialog(false)}
        size="lg"
      >
        <DialogHeader>Detalles de Vacunación</DialogHeader>
        <DialogBody>
          {vacunaToAction && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography className="font-semibold">Animal</Typography>
                <Typography>ID Hembra: {vacunaToAction.idHembra}</Typography>
                <Typography>Especie: {vacunaToAction.especie}</Typography>
                <Typography>Raza: {vacunaToAction.raza}</Typography>
                <Typography>Edad: {vacunaToAction.edad} meses</Typography>
              </div>
              <div>
                <Typography className="font-semibold">Vacuna</Typography>
                <Typography>Tipo: {vacunaToAction.tipoVacuna}</Typography>
                <Typography>
                  Dosis: {vacunaToAction.dosisAdministrada}
                </Typography>
                <Typography>
                  Próxima dosis: {formatDate(vacunaToAction.fechaProximaDosis)}
                </Typography>
                <Typography>
                  Veterinario: {vacunaToAction.veterinario}
                </Typography>
              </div>
              <div className="md:col-span-2">
                <Typography className="font-semibold">Observaciones</Typography>
                <Typography>
                  {vacunaToAction.observaciones || "Ninguna"}
                </Typography>
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
};

export default Vacunaciones;
