/* eslint-disable react/display-name */
import { useState, useEffect } from "react";
import {
  listarVentas,
  registrarVenta,
  actualizarVenta,
  eliminarVenta,
} from "../services/ventaService";
import { listarAnimales } from "../services/animalService";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

// 🔹 Imports de MUI + react-virtuoso
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableVirtuoso } from "react-virtuoso";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 NUEVO: Tipo de cambio (puedes hacerlo editable o traerlo de una API)
  const [tipoCambio, setTipoCambio] = useState(6.96); // Bs por USD

  const initialFormState = {
    comprador: "",
    propiedad: "",
    cantidad: "",
    gma: "",
    clase: "",
    precioUnitario: "",
    totalBs: "",
    totalUsd: "",
    observacion: "",
    cantidadDia: "",
    idAnimal: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [ventaId, setVentaId] = useState(null);

  // 🔹 NUEVO: useEffect para calcular totales automáticamente
  useEffect(() => {
    const cantidad = Number(formData.cantidad) || 0;
    const precioUnitario = Number(formData.precioUnitario) || 0;

    if (cantidad > 0 && precioUnitario > 0) {
      const totalBs = cantidad * precioUnitario;
      const totalUsd = totalBs / tipoCambio;

      setFormData((prev) => ({
        ...prev,
        totalBs: totalBs.toFixed(2),
        totalUsd: totalUsd.toFixed(2),
      }));
    } else if (cantidad === 0 || precioUnitario === 0) {
      // Limpiar totales si algún campo es 0 o vacío
      setFormData((prev) => ({
        ...prev,
        totalBs: "",
        totalUsd: "",
      }));
    }
  }, [formData.cantidad, formData.precioUnitario, tipoCambio]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.comprador.trim()) {
      errors.comprador = "El nombre del comprador es obligatorio.";
      isValid = false;
    }
    if (!formData.clase.trim()) {
      errors.clase = "La clase/categoría del animal es obligatoria.";
      isValid = false;
    }
    if (!formData.idAnimal) {
      errors.idAnimal = "Debe seleccionar un animal para la venta.";
      isValid = false;
    }
    if (!formData.gma.trim()) {
      errors.gma = "La Guía de Movimiento Animal (GMA) es obligatoria.";
      isValid = false;
    }

    // Validar campos numéricos (cantidad y precioUnitario)
    const numericFields = ["cantidad", "precioUnitario"];
    numericFields.forEach((field) => {
      const value = String(formData[field]).trim();
      if (value === "" || isNaN(Number(value)) || Number(value) <= 0) {
        errors[field] = `El campo ${field.replace(
          /([A-Z])/g,
          " $1"
        )} debe ser un número positivo.`;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listaVentas = await listarVentas();
        const listaAnimales = await listarAnimales();
        setVentas(listaVentas);
        setAnimales(listaAnimales);
      } catch (error) {
        setError("Error al cargar datos: " + error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔹 Validación en tiempo real solo para campos numéricos (cantidad y precioUnitario)
    if (name === "cantidad" || name === "precioUnitario") {
      // Permitir solo números y un punto decimal
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    // Limpiar error cuando el usuario empieza a corregir
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAnimalChange = (e) => {
    setFormData({ ...formData, idAnimal: e.target.value });
    if (validationErrors.idAnimal) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.idAnimal;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error("Errores de validación encontrados.");
      return;
    }

    const dataToSend = {
      ...formData,
      precioUnitario: Math.round(Number(formData.precioUnitario) * 100),
      totalBs: Math.round(Number(formData.totalBs) * 100),
      totalUsd: Math.round(Number(formData.totalUsd) * 100),
      cantidad: Number(formData.cantidad),
      gma: formData.gma.trim(), // 🔹 GMA se envía como string
      cantidadDia: Number(formData.cantidadDia || 0),
    };

 
    const executeSave = async () => {
      try {
        if (editMode) {
          await actualizarVenta(
            ventaId,
            dataToSend.comprador,
            dataToSend.propiedad,
            dataToSend.cantidad,
            dataToSend.gma,
            dataToSend.clase,
            dataToSend.precioUnitario,
            dataToSend.totalBs,
            dataToSend.totalUsd,
            dataToSend.observacion,
            dataToSend.cantidadDia
          );
          alert("✅ Venta actualizada con éxito");
        } else {
          await registrarVenta(
            dataToSend.comprador,
            dataToSend.propiedad,
            dataToSend.cantidad,
            dataToSend.gma,
            dataToSend.clase,
            dataToSend.precioUnitario,
            dataToSend.totalBs,
            dataToSend.totalUsd,
            dataToSend.observacion,
            dataToSend.cantidadDia,
            dataToSend.idAnimal
          );
          alert("✅ Venta registrada con éxito");
        }

        setVentas(await listarVentas());
        resetForm();
      } catch (error) {
        const errorMessage = error.message || "Error desconocido";
        alert("❌ Error al guardar la venta: " + errorMessage);
        console.error("Error detallado:", error);
      }
    };


    executeSave();
  };

  const handleEditVenta = (venta) => {
    setEditMode(true);
    setVentaId(venta.id);
    // 🔹 Convertir valores de blockchain a decimales para edición
    setFormData({
      ...venta,
      precioUnitario: (Number(venta.precioUnitario) / 100).toFixed(2),
      totalBs: (Number(venta.totalBs) / 100).toFixed(2),
      totalUsd: (Number(venta.totalUsd) / 100).toFixed(2),
      gma: venta.gma, // 🔹 GMA ya es string, no necesita conversión
    });
  };

  const handleDeleteVenta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      await eliminarVenta(id);
      setVentas(await listarVentas());
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setValidationErrors({});
    setEditMode(false);
    setVentaId(null);
  };

  // 🔹 Definición de columnas para la tabla virtualizada
  const columns = [
    { label: "Comprador", dataKey: "comprador", width: 150 },
    { label: "Cantidad", dataKey: "cantidad", width: 100 },
    { label: "Precio Unit.", dataKey: "precioUnitario", width: 120 },
    { label: "Total (Bs)", dataKey: "totalBs", width: 120 },
    { label: "Total (USD)", dataKey: "totalUsd", width: 120 },
    { label: "Acciones", dataKey: "acciones", width: 180 },
  ];

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead: React.forwardRef((props, ref) => (
      <TableHead {...props} ref={ref} />
    )),
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
    TableRow,
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric ? "right" : "left"}
          sx={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (_index, venta) => (
    <>
      <TableCell
        sx={{
          color: "var(--text)",
          backgroundColor: "var(--background)",
        }}
      >
        {venta.comprador}
      </TableCell>

      <TableCell
        sx={{
          color: "var(--text)",
          backgroundColor: "var(--background)",
        }}
      >
        {venta.cantidad}
      </TableCell>

      <TableCell
        sx={{
          color: "var(--text)",
          backgroundColor: "var(--background)",
        }}
      >
        {(Number(venta.precioUnitario) / 100).toFixed(2)} Bs
      </TableCell>

      <TableCell
        sx={{
          color: "var(--secondary)",
          backgroundColor: "var(--background)",
          fontWeight: 600,
        }}
      >
        {(Number(venta.totalBs) / 100).toFixed(2)} Bs
      </TableCell>

      <TableCell
        sx={{
          color: "var(--primary)",
          backgroundColor: "var(--background)",
          fontWeight: 600,
        }}
      >
        ${(Number(venta.totalUsd) / 100).toFixed(2)}
      </TableCell>

      <TableCell
        sx={{
          backgroundColor: "var(--background)",
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => handleEditVenta(venta)}
            className="flex items-center px-3 py-1 text-white transition-colors rounded"
            style={{
              backgroundColor: "var(--secondary)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--secondary)")
            }
          >
            <PencilIcon className="h-4 mr-1" /> Edit
          </button>

          <button
            onClick={() => handleDeleteVenta(venta.id)}
            className="flex items-center px-3 py-1 text-white transition-colors rounded"
            style={{
              backgroundColor: "crimson",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#b30000")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "crimson")
            }
          >
            <TrashIcon className="h-4 mr-1" /> Del.
          </button>
        </div>
      </TableCell>
    </>
  );


  return (
    <div className="max-w-5xl p-4 mx-auto rounded-lg bg-background">
      <h2 className="my-6 text-3xl font-bold text-primary">
        Gestión de Ventas
      </h2>

      {loading && <p className="text-center text-accent">Cargando datos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🔹 NUEVO: Configuración del tipo de cambio */}
      <div className="p-4 mb-4 border rounded-lg border-secondary/90 bg-primary/10">
        <label className="block mb-2 text-sm font-medium text-text">
          Tipo de Cambio (Bs por USD)
        </label>
        <input
          type="number"
          step="0.01"
          value={tipoCambio}
          onChange={(e) => setTipoCambio(Number(e.target.value) || 6.96)}
          className="w-48 p-2 border rounded bg-background"
          placeholder="6.96"
        />
        <p className="mt-1 text-xs text-gray-500">
          Este valor se usa para calcular el total en USD automáticamente
        </p>
      </div>

      {/* 🔹 Formulario */}
      <div className="grid grid-cols-1 gap-4 p-6 border rounded-lg md:grid-cols-2 bg-background">
        {Object.keys(initialFormState).map((key) =>
          key === "idAnimal" ? (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium text-text">
                Selecciona un animal *
              </label>
              <select
                name={key}
                value={formData[key]}
                onChange={handleAnimalChange}
                className={`w-full p-2 border rounded bg-background ${
                  validationErrors[key] ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar</option>
                {animales.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nombre} (ID: {animal.id})
                  </option>
                ))}
              </select>
              {validationErrors[key] && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors[key]}
                </p>
              )}
            </div>
          ) : (
            <div
              key={key}
              className={key.includes("total") ? "md:col-span-1" : ""}
            >
              <label className="block mb-1 text-sm font-medium capitalize text-text">
                {key.replace(/([A-Z])/g, " $1")}
                {(key === "comprador" ||
                  key === "clase" ||
                  key === "cantidad" ||
                  key === "gma" ||
                  key === "precioUnitario") &&
                  " *"}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  key.includes("total")
                    ? "bg-background border-none font-semibold text-green-700"
                    : "bg-background"
                } ${
                  validationErrors[key] ? "border-red-500" : "border-gray-300"
                }`}
                readOnly={key.includes("total")}
                placeholder={
                  key === "cantidad"
                    ? "Ej: 10"
                    : key === "precioUnitario"
                    ? "Ej: 150.50"
                    : key === "gma"
                    ? "Ej: GMA-2024-001"
                    : key.includes("total")
                    ? "Se calcula automáticamente"
                    : ""
                }
              />
              {validationErrors[key] && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors[key]}
                </p>
              )}
              {key.includes("total") && formData[key] && (
                <p className="mt-1 text-xs text-gray-500">
                  💰 Calculado automáticamente
                </p>
              )}
            </div>
          )
        )}

        <div className="flex items-center justify-between mt-4 md:col-span-2">
          <button
            onClick={resetForm}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-secondary"
          >
            {editMode ? "Actualizar Venta" : "Agregar Venta"}
          </button>
        </div>
      </div>

      {/* 🔹 Tabla mejorada */}
      <Paper
        className="venta-table bg-none"
        style={{ height: 400, width: "100%", marginTop: "1.5rem" }}
      >
        {ventas.length > 0 ? (
          <TableVirtuoso
            data={ventas}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No hay ventas registradas.
          </div>
        )}
      </Paper>
    </div>
  );
}