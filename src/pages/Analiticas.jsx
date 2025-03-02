// Analiticas.jsx

import React, { useEffect, useState } from "react";
import { listarAnimales } from "../services/animalService";
import { listarVentas } from "../services/ventaService";
import { listarProductos } from "../services/productoService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null); // Estado para el filtro

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

        setStats({
          animales: animales.length,
          ventas: ventas.length,
          productos: productos.length,
          hembras: hembras,
          totalVentasBs: totalVentasBs,
          productosStock: productosStock,
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
      <div className="p-5">
        <p>Cargando datos...</p>
      </div>
    );
  }

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const labels = ["Animales", "Ventas", "Productos"];
      setFilter(labels[clickedIndex]);
    } else {
      setFilter(null); // Limpiar el filtro si no se hace clic en una barra
    }
  };

  return (
    <>
      <div className="p-5">
        <h2 className="text-2xl font-bold">📊 Dashboard de Analíticas</h2>
        <Bar
          key="analiticas-bar-chart"
          data={{
            labels: ["Animales", "Ventas", "Productos"],
            datasets: [
              {
                label: "Cantidad en Blockchain",
                data: [stats.animales, stats.ventas, stats.productos],
                backgroundColor: ["blue", "green", "orange"],
              },
            ],
          }}
          options={{
            onClick: handleBarClick,
          }}
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Totales Adicionales {filter ? `(${filter})` : ""}
          </h3>
          {filter === "Animales" && <p>Total de Hembras: {stats.hembras}</p>}
          {filter === "Ventas" && (
            <p>Total de Ventas en Bs: {stats.totalVentasBs}</p>
          )}
          {filter === "Productos" && (
            <p>Total de Productos en Stock: {stats.productosStock}</p>
          )}
          {!filter && (
            <>
              <p>Total de Hembras: {stats.hembras}</p>
              <p>Total de Ventas en Bs: {stats.totalVentasBs}</p>
              <p>Total de Productos en Stock: {stats.productosStock}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Analiticas;
