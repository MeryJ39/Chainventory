import { useContext, useEffect, useState } from "react";
import { listarAnimales } from "../services/animalService";
import { listarVentas } from "../services/ventaService";
import { listarProductos } from "../services/productoService";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiBarChart2,
  FiUser,
  FiHome,
  FiCalendar,
} from "react-icons/fi";

import { AuthContext } from "../context/authContext";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analiticas = () => {
  const [stats, setStats] = useState({
    animales: 0,
    ventas: 0,
    productos: 0,
    hembras: 0,
    totalVentasBs: 0,
    productosStock: 0,
    ventasPorFecha: [],
    categoriasAnimales: {},
    estatusAnimales: {},
    ventasPorComprador: {},
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 Cargando datos de analíticas..." + user);
    const fetchData = async () => {
      try {
        const animales = await listarAnimales();
        const ventas = await listarVentas();
        const productos = await listarProductos();

        const hembras = animales.filter(
          (animal) => !animal.idHembra.includes("MACHO-")
        ).length;

        const totalVentasBs = ventas.reduce(
          (acc, venta) => acc + venta.totalBs,
          0
        );
        const productosStock = productos.reduce(
          (acc, producto) => acc + producto.cantidad,
          0
        );

        const ventasPorFecha = ventas.reduce((acc, venta) => {
          const fecha = new Date(venta.fechaVenta * 1000).toLocaleDateString();
          acc[fecha] = (acc[fecha] || 0) + 1;
          return acc;
        }, {});

        const categoriasAnimales = animales.reduce((acc, animal) => {
          acc[animal.categoriaActual] = (acc[animal.categoriaActual] || 0) + 1;
          return acc;
        }, {});

        const estatusAnimales = animales.reduce((acc, animal) => {
          acc[animal.estatus] = (acc[animal.estatus] || 0) + 1;
          return acc;
        }, {});

        const ventasPorComprador = ventas.reduce((acc, venta) => {
          acc[venta.comprador] = (acc[venta.comprador] || 0) + 1;
          return acc;
        }, {});

        setStats({
          animales: animales.length,
          ventas: ventas.length,
          productos: productos.length,
          hembras: hembras,
          totalVentasBs: totalVentasBs,
          productosStock: productosStock,
          ventasPorFecha: Object.entries(ventasPorFecha),
          categoriasAnimales: Object.entries(categoriasAnimales),
          estatusAnimales: Object.entries(estatusAnimales),
          ventasPorComprador: Object.entries(ventasPorComprador),
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.rol]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <p className="text-xl font-semibold">Cargando datos...</p>
      </div>
    );
  }

  // Si no es administrador, mostrar pantalla de bienvenida para encargado de inventario bovino
  if (user?.rol !== "administrador") {
    return (
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center">
            <Typography variant="h1" className="mb-4 font-bold">
              ¡Bienvenido, {user?.nombre || "Usuario"}!
            </Typography>
            <Typography variant="lead" className="mb-2 text-primary">
              Encargado de Inventario Bovino
            </Typography>
            <Typography className="text-secondary">
              Sistema de Gestión Ganadera - Panel de Control
            </Typography>
          </header>

          {/* User Info Card */}
          <Card className="p-6 mb-8 border border-green-100 shadow-xl bg-background rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-4 mr-4 text-white rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <FiUser size={28} />
                </div>
                <div>
                  <Typography variant="h4" className="mb-1">
                    Tu información
                  </Typography>
                  <Typography className="text-lg">
                    Rol:{" "}
                    <span className="font-semibold text-green-700">
                      {user?.rol || "Encargado de Inventario"}
                    </span>
                  </Typography>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="px-4 py-2 bg-green-100 rounded-full">
                  <Typography className="font-medium text-green-800">
                    Sistema Activo
                  </Typography>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <Card className="p-6 text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="mb-1 text-blue-100">
                    Inventario
                  </Typography>
                  <Typography variant="h3" className="font-bold">
                    Activo
                  </Typography>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  <FiHome size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 text-white shadow-lg bg-gradient-to-r from-primary to-secondary rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="mb-1 text-white/80">Ganado</Typography>
                  <Typography variant="h3" className="font-bold">
                    Bovino
                  </Typography>
                </div>
                <div className="p-3 rounded-full bg-white/50">
                  <FiBarChart2 size={24} />
                </div>
              </div>
            </Card>

            <Card className="p-6 text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="mb-1 text-amber-100">
                    Gestión
                  </Typography>
                  <Typography variant="h3" className="font-bold">
                    Diaria
                  </Typography>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  <FiCalendar size={24} />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
            {/* Inventario Section */}
            <Card className="p-8 transition-all bg-white border border-blue-100 hover:shadow-2xl hover:-translate-y-1 rounded-2xl">
              <div className="flex items-start mb-4">
                <div className="p-4 mr-4 text-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <FiHome size={24} />
                </div>
                <div className="flex-1">
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="mb-2 font-bold"
                  >
                    Inventario Bovino
                  </Typography>
                  <Typography color="blue-gray" className="mb-4 text-lg">
                    Gestiona el inventario completo de animales disponibles y su
                    información detallada.
                  </Typography>
                  <Button
                    className="flex items-center bg-blue-500 shadow-lg hover:bg-blue-600"
                    onClick={() => navigate("/dashboard/animales")}
                  >
                    <FiHome className="mr-2" /> Acceder al Inventario
                  </Button>
                </div>
              </div>
            </Card>

            {/* Dashboard Section */}
            <Card className="p-8 transition-all bg-white border border-green-100 hover:shadow-2xl hover:-translate-y-1 rounded-2xl">
              <div className="flex items-start mb-4">
                <div className="p-4 mr-4 text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <FiBarChart2 size={24} />
                </div>
                <div className="flex-1">
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="mb-2 font-bold"
                  >
                    Panel de Control
                  </Typography>
                  <Typography color="blue-gray" className="mb-4 text-lg">
                    Accede a todas las herramientas de gestión ganadera desde tu
                    panel personalizado.
                  </Typography>
                  <Button
                    className="flex items-center bg-green-500 shadow-lg hover:bg-green-600"
                    onClick={() => navigate("/dashboard")}
                  >
                    <FiBarChart2 className="mr-2" /> Ir al Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics Info */}
          <Card className="p-8 border-2 shadow-lg border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl">
            <div className="flex items-start">
              <div className="p-4 mr-6 text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                <FiBarChart2 size={28} />
              </div>
              <div className="flex-1">
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="mb-3 font-bold"
                >
                  Analíticas Avanzadas
                </Typography>
                <Typography color="blue-gray" className="mb-3 text-lg">
                  Las funciones de analíticas avanzadas, informes detallados y
                  auditorías del sistema están disponibles exclusivamente para
                  administradores.
                </Typography>
                <Typography
                  color="blue-gray"
                  className="font-medium text-amber-800"
                >
                  💡 Si necesitas acceso a estas funciones, contacta al
                  administrador del sistema.
                </Typography>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <h2 className="mb-6 text-3xl font-bold text-text">
        Dashboard de Analíticas
      </h2>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <div className="p-4 text-center rounded-lg shadow-md bg-background">
          <FiBox className="mx-auto text-4xl text-primary" />
          <h3 className="text-lg font-semibold text-text">Total Animales</h3>
          <p className="text-2xl font-bold">{stats.animales}</p>
        </div>

        <div className="p-4 text-center rounded-lg shadow-md bg-background">
          <FiDollarSign className="mx-auto text-4xl text-green-500" />
          <h3 className="text-lg font-semibold text-text">Total Ventas (Bs)</h3>
          <p className="text-2xl font-bold">
            {(stats.totalVentasBs / 100).toFixed(2)}
          </p>
        </div>

        <div className="p-4 text-center rounded-lg shadow-md bg-background">
          <FiShoppingCart className="mx-auto text-4xl text-yellow-500" />
          <h3 className="text-lg font-semibold text-text">
            Productos en Stock
          </h3>
          <p className="text-2xl font-bold">{stats.productosStock}</p>
        </div>

        <div className="p-4 text-center rounded-lg shadow-md bg-background">
          <FiBarChart2 className="mx-auto text-4xl text-purple-500" />
          <h3 className="text-lg font-semibold text-text">Hembras</h3>
          <p className="text-2xl font-bold">{stats.hembras}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        <div className="p-4 rounded-lg shadow-md bg-background ">
          <h3 className="mb-2 text-lg font-semibold text-text ">
            Categorías de Animales
          </h3>
          <Pie
            data={{
              labels: stats.categoriasAnimales.map(([categoria]) => categoria),
              datasets: [
                {
                  data: stats.categoriasAnimales.map(
                    ([, cantidad]) => cantidad
                  ),
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
                },
              ],
            }}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md bg-background">
          <h3 className="mb-2 text-lg font-semibold text-text">
            Estatus de Animales
          </h3>
          <Bar
            data={{
              labels: stats.estatusAnimales.map(([estatus]) => estatus),
              datasets: [
                {
                  label: "Estatus",
                  data: stats.estatusAnimales.map(([, cantidad]) => cantidad),
                  backgroundColor: ["#36a2eb", "#ff6384"],
                },
              ],
            }}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md bg-background">
          <h3 className="mb-2 text-lg font-semibold text-text">
            Ventas por Fecha
          </h3>
          <Line
            data={{
              labels: stats.ventasPorFecha.map(([fecha]) => fecha),
              datasets: [
                {
                  label: "Ventas",
                  data: stats.ventasPorFecha.map(([, cantidad]) => cantidad),
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md bg-background">
          <h3 className="mb-2 text-lg font-semibold text-text">
            Ventas por Comprador
          </h3>
          <Bar
            data={{
              labels: stats.ventasPorComprador.map(([comprador]) => comprador),
              datasets: [
                {
                  label: "Ventas",
                  data: stats.ventasPorComprador.map(
                    ([, cantidad]) => cantidad
                  ),
                  backgroundColor: "#4bc0c0",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analiticas;
