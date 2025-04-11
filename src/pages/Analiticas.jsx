import { useEffect, useState } from "react";
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
} from "react-icons/fi";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animales = await listarAnimales();
        const ventas = await listarVentas();
        const productos = await listarProductos();

        const hembras = animales.filter((animal) => animal.idHembra).length;
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
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <p className="text-xl font-semibold">Cargando datos...</p>
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
          <p className="text-2xl font-bold">{stats.totalVentasBs.toFixed(2)}</p>
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
