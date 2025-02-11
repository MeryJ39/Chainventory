// Analiticas.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analiticas = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tendencia de Peso del Ganado",
      },
    },
  };

  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Peso (kg)",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Peso Promedio (kg)",
        data: [40, 30, 50, 60, 70, 80, 90],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h6" color="white">
          Analíticas
        </Typography>
      </CardHeader>
      <CardBody>
        {/* Contenido de la página de analíticas */}
        <Typography variant="h5" color="blue" className="mb-4">
          Aquí se mostrarán las analíticas del inventario.
        </Typography>
        <Line options={options} data={data} />
        {/* Puedes agregar gráficos, tablas, etc. */}
      </CardBody>
    </Card>
  );
};

export default Analiticas;
