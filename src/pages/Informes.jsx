import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable"; // Using named import as suggested
import { listarAnimales } from "../services/animalService";
import { listarVentas } from "../services/ventaService";
import { listarProductos } from "../services/productoService";
import { Select, Option, Card, Typography } from "@material-tailwind/react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

const Informes = () => {
  const [animales, setAnimales] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [reportType, setReportType] = useState("inventario"); // Default report type

  useEffect(() => {
    const fetchData = async () => {
      setAnimales(await listarAnimales());
      setVentas(await listarVentas());
      setProductos(await listarProductos());
      console.log(productos);
    };
    fetchData();
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    let startY = 10; // Initial Y position for content

    doc.text(
      `Informe de ${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Blockchain`,
      14,
      startY
    );
    startY += 10; // Increment Y position for next content

    if (reportType === "inventario" || reportType === "animales") {
      // 🐄 Animales
      autoTable(doc, {
        startY: startY,
        head: [["ID", "Nombre", "Ganadera", "Edad", "Estatus"]],
        body: animales.map((a) => [
          a.id,
          a.nombre,
          a.ganadera,
          a.edad,
          a.estatus,
        ]),
      });
      startY = doc.lastAutoTable.finalY + 10; // Update startY for next table if needed
      if (reportType === "inventario") {
        startY += 10; // Add more space if more tables are coming
      }
    }

    if (reportType === "inventario" || reportType === "ventas") {
      // 🛒 Ventas
      autoTable(doc, {
        startY: startY,
        head: [["ID", "Comprador", "Cantidad", "Total Bs", "Fecha"]],
        body: ventas.map((v) => [
          v.id,
          v.comprador,
          v.cantidad,
          v.totalBs,
          new Date(v.fechaVenta * 1000).toLocaleDateString(),
        ]),
      });
      startY = doc.lastAutoTable.finalY + 10; // Update startY
      if (reportType === "inventario") {
        startY += 10; // Add more space if more tables are coming
      }
    }

    if (reportType === "inventario" || reportType === "productos") {
      // 📦 Productos
      autoTable(doc, {
        startY: startY,
        head: [["ID", "Tipo", "Cantidad", "Saldo", "Destino"]],
        body: productos.map((p) => [
          p.id,
          p.tipo,
          p.cantidad,
          p.saldo,
          p.destino,
        ]),
      });
      startY = doc.lastAutoTable.finalY + 10; // Update startY
    }

    doc.save(`reporte_${reportType}.pdf`);
  };

  const handleReportTypeChange = (value) => {
    // Material Tailwind Select returns value directly
    setReportType(value);
  };

  const ReportTypeSelect = () => {
    // Renamed and moved Select component inside Informes
    return (
      <div className="w-72">
        <Select
          label="Tipo de Reporte"
          value={reportType} // Control the selected value
          onChange={handleReportTypeChange} // Use the updated handler
        >
          <Option value="inventario">Inventario Completo</Option>
          <Option value="animales">Animales</Option>
          <Option value="ventas">Ventas</Option>
          <Option value="productos">Productos</Option>
        </Select>
      </div>
    );
  };

  // Table Components using Material Tailwind Table
  const AnimalTable = ({ data }) => {
    const TABLE_HEAD = ["ID", "Nombre", "Ganadera", "Edad", "Estatus"];
    return (
      <Card className="w-full h-full mt-4 overflow-scroll">
        <Typography variant="h5" color="blue-gray" className="p-4 mb-2">
          🐄 Animales
        </Typography>
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={row.id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.id}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.nombre}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.ganadera}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.edad}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.estatus}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    );
  };

  const VentaTable = ({ data }) => {
    const TABLE_HEAD = ["ID", "Comprador", "Cantidad", "Total Bs", "Fecha"];
    return (
      <Card className="w-full h-full mt-4 overflow-scroll">
        <Typography variant="h5" color="blue-gray" className="p-4 mb-2">
          🛒 Ventas
        </Typography>
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={row.id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.id}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.comprador}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.cantidad}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.totalBs}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {new Date(row.fechaVenta * 1000).toLocaleDateString()}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    );
  };

  const ProductoTable = ({ data }) => {
    const TABLE_HEAD = ["ID", "Tipo", "Cantidad", "Saldo", "Destino"];
    return (
      <Card className="w-full h-full mt-4 overflow-scroll">
        <Typography variant="h5" color="blue-gray" className="p-4 mb-2">
          📦 Productos
        </Typography>
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={row.id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.id}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.tipo}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.cantidad}
                    </Typography>
                  </td>
                  <td className={`${classes} bg-blue-gray-50/50`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.saldo}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.destino}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    );
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">📑 Generar Reportes</h2>

      <div className="flex items-center gap-4 mt-4">
        <ReportTypeSelect />
        <button
          className="flex p-2 rounded bg-primary text-background"
          onClick={generarPDF}
        >
          Descargar PDF
          <ArrowDownIcon className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Conditional rendering of tables for preview */}
      {reportType === "inventario" && (
        <>
          <AnimalTable data={animales} />
          <VentaTable data={ventas} />
          <ProductoTable data={productos} />
        </>
      )}
      {reportType === "animales" && <AnimalTable data={animales} />}
      {reportType === "ventas" && <VentaTable data={ventas} />}
      {reportType === "productos" && <ProductoTable data={productos} />}
    </div>
  );
};

export default Informes;
