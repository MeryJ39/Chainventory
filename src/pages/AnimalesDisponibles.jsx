import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Spinner,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter, 
  Select,
  Option
} from "@material-tailwind/react";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listarAnimales } from "../services/animalService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AnimalesDisponibles = () => {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "",
    edadMin: "",
    edadMax: "",
  });

  // Categorías disponibles
  const CATEGORIAS = ["Ternero", "Novillo", "Vaquillona", "Vaca", "Toro"];

  // Cargar animales al montar el componente
  useEffect(() => {
    const fetchAnimales = async () => {
      setLoading(true);
      try {
        const lista = await listarAnimales();
        setAnimales(lista);
      } catch (error) {
        console.error("Error al cargar animales:", error);
        setError("Error al cargar los animales disponibles");
        toast.error("Error al cargar los animales");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimales();
  }, []);

  // Filtrar animales
  const filteredAnimals = animales.filter(animal => {
    // Filtrar por estatus (solo activos)
    if (animal.estatus !== "Activo") return false;
    
    // Filtrar por tab activo
    if (activeTab !== "todos" && animal.categoriaActual !== activeTab) return false;
    
    // Filtrar por término de búsqueda
    if (searchTerm && !animal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ){      return false
    }
    
    // Filtrar por categoría
    if (filters.categoria && animal.categoriaActual !== filters.categoria) {
      return false;
    }
    
    // Filtrar por edad mínima
    if (filters.edadMin && animal.edad < parseInt(filters.edadMin)) {
      return false;
    }
    
    // Filtrar por edad máxima
    if (filters.edadMax && animal.edad > parseInt(filters.edadMax)) {
      return false;
    }
    
    // Filtrar por fecha de ingreso
    if (filters.fechaIngreso) {
      const fechaIngreso = new Date(animal.fechaIngreso * 1000);
      const filterDate = new Date(filters.fechaIngreso);
      if (
        fechaIngreso.getFullYear() !== filterDate.getFullYear() ||
        fechaIngreso.getMonth() !== filterDate.getMonth() ||
        fechaIngreso.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }
    
    return true;
  });

  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Manejar interés en un animal
  const handleInteres = (animal) => {
    toast.success(`Has mostrado interés en ${animal.nombre}. Nos pondremos en contacto contigo.`);
    // Aquí podrías implementar lógica para registrar el interés del cliente
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <Typography variant="h2" className="mb-6 text-3xl font-bold">
        Animales Disponibles
      </Typography>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<i className="fas fa-search" />}
          />
          
          <Select
            label="Categoría"
            value={filters.categoria}
            onChange={(value) => setFilters({...filters, categoria: value})}
          >
            <Option value="">Todas las categorías</Option>
            {CATEGORIAS.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
          
          <div className="flex gap-2">
            <Input
              label="Edad mínima"
              type="number"
              value={filters.edadMin}
              onChange={(e) => setFilters({...filters, edadMin: e.target.value})}
              min="0"
            />
            <Input
              label="Edad máxima"
              type="number"
              value={filters.edadMax}
              onChange={(e) => setFilters({...filters, edadMax: e.target.value})}
              min="0"
            />
          </div>
          
          
          
        </CardBody>
      </Card>

      {/* Tabs de categorías */}
      <Tabs value={activeTab} className="mb-6">
        <TabsHeader>
          <Tab value="todos" onClick={() => setActiveTab("todos")}>
            Todos
          </Tab>
          {CATEGORIAS.map(categoria => (
            <Tab 
              key={categoria} 
              value={categoria} 
              onClick={() => setActiveTab(categoria)}
            >
              {categoria}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>

      {/* Lista de animales */}
      {loading ? (
        <div className="flex justify-center">
          <Spinner className="w-8 h-8" />
        </div>
      ) : error ? (
        <Typography color="red" className="text-center">
          {error}
        </Typography>
      ) : filteredAnimals.length === 0 ? (
        <Typography className="text-center text-gray-500">
          No hay animales disponibles con los filtros seleccionados
        </Typography>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
            <Card key={animal.id} className="transition-shadow hover:shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="h5" className="font-bold">
                      {animal.nombre}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      ID: {animal.idHembra}
                    </Typography>
                  </div>
                  <Chip
                    value={animal.categoriaActual}
                    color={
                      animal.categoriaActual === "Vaca" ? "green" : 
                      animal.categoriaActual === "Toro" ? "red" : "amber"
                    }
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <Typography>
                    <span className="font-semibold">Edad:</span> {animal.edad} meses
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Ganadera:</span> {animal.ganadera}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Ingreso:</span> {formatDate(animal.fechaIngreso)}
                  </Typography>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setOpenDetailDialog(true);
                    }}
                  >
                    <EyeIcon className="w-5 h-5 mr-2" /> Ver detalles
                  </Button>
                  <Button
                    color="pink"
                    onClick={() => handleInteres(animal)}
                  >
                    <HeartIcon className="w-5 h-5 mr-2" /> Me interesa
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de detalles */}
      <Dialog
        open={openDetailDialog}
        handler={() => setOpenDetailDialog(false)}
        size="lg"
      >
        <DialogHeader>Detalles del Animal</DialogHeader>
        <DialogBody>
          {selectedAnimal ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Typography variant="h6" className="mb-2 font-bold">
                  Información Básica
                </Typography>
                <Typography><span className="font-semibold">Nombre:</span> {selectedAnimal.nombre}</Typography>
                <Typography><span className="font-semibold">ID Hembra:</span> {selectedAnimal.idHembra}</Typography>
                <Typography><span className="font-semibold">Ganadera:</span> {selectedAnimal.ganadera}</Typography>
                <Typography><span className="font-semibold">Categoría:</span> {selectedAnimal.categoriaActual}</Typography>
              </div>
              
              <div>
                <Typography variant="h6" className="mb-2 font-bold">
                  Datos Técnicos
                </Typography>
                <Typography><span className="font-semibold">Edad:</span> {selectedAnimal.edad} meses</Typography>
                <Typography><span className="font-semibold">Fecha Nacimiento:</span> {formatDate(selectedAnimal.fechaNacimiento)}</Typography>
                <Typography><span className="font-semibold">Fecha Ingreso:</span> {formatDate(selectedAnimal.fechaIngreso)}</Typography>
                <Typography><span className="font-semibold">Estado:</span> 
                  <Chip
                    value={selectedAnimal.estatus}
                    color={selectedAnimal.estatus === "Activo" ? "green" : "red"}
                    className="inline-block ml-2"
                  />
                </Typography>
              </div>
              
              {selectedAnimal.causaMortalidad && (
                <div className="md:col-span-2">
                  <Typography variant="h6" className="mb-2 font-bold">
                    Historial
                  </Typography>
                  <Typography><span className="font-semibold">Fecha Retiro:</span> {formatDate(selectedAnimal.fechaRetiro)}</Typography>
                  <Typography><span className="font-semibold">Causa:</span> {selectedAnimal.causaMortalidad}</Typography>
                </div>
              )}
            </div>
          ) : (
            <Spinner className="w-8 h-8 mx-auto" />
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="pink"
            onClick={() => {
              if (selectedAnimal) handleInteres(selectedAnimal);
              setOpenDetailDialog(false);
            }}
            className="mr-2"
          >
            <HeartIcon className="w-5 h-5 mr-2" /> Me interesa
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenDetailDialog(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AnimalesDisponibles;