import React, { useState } from "react";
import useVentas from "../hooks/useVentas";

const Ventas = () => {
  const { ventas, loading, error, createVenta, deleteVenta, updateVenta } =
    useVentas();

  const initialFormState = {
    fecha_ingreso_ctas: "",
    comprador: "",
    propiedad: "",
    cantidad: "",
    gma: "",
    fecha_dia: "",
    clase: "",
    precio_unitario: "",
    total_venta_bs: "",
    total_venta_usd: "",
    observacion: "",
    cantidad_dia: "",
    id_animal: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editMode, setEditMode] = useState(false);
  const [ventaId, setVentaId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDecimal = (value) => {
    return value && typeof value === "object" && "$numberDecimal" in value
      ? Number(value.$numberDecimal)
      : Number(value) || 0;
  };

  const formatFormData = (data) => {
    return {
      ...data,
      cantidad: Number(data.cantidad) || 0,
      precio_unitario: formatDecimal(data.precio_unitario),
      total_venta_bs: formatDecimal(data.total_venta_bs),
      total_venta_usd: formatDecimal(data.total_venta_usd),
      cantidad_dia: Number(data.cantidad_dia) || 0,
    };
  };

  const handleCreateVenta = async (e) => {
    e.preventDefault();
    await createVenta(formatFormData(formData));
    resetForm();
  };

  const handleEditVenta = (venta) => {
    setEditMode(true);
    setVentaId(venta._id);
    setFormData({
      ...venta,
      precio_unitario: formatDecimal(venta.precio_unitario),
      total_venta_bs: formatDecimal(venta.total_venta_bs),
      total_venta_usd: formatDecimal(venta.total_venta_usd),
    });
  };

  const handleUpdateVenta = async (e) => {
    e.preventDefault();
    await updateVenta(ventaId, formatFormData(formData));
    setEditMode(false);
    setVentaId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-background">
      <h2 className="mb-4 text-2xl font-bold">Gestión de Ventas</h2>

      {loading && <p className="text-blue-500">Cargando ventas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={editMode ? handleUpdateVenta : handleCreateVenta}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {Object.keys(initialFormState).map((key) => (
          <input
            key={key}
            type={
              key.includes("fecha")
                ? "date"
                : key.includes("cantidad") ||
                  key.includes("precio") ||
                  key.includes("total")
                ? "number"
                : "text"
            }
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="p-2 border border-gray-400 rounded bg-background text-text"
            placeholder={key.replace("_", " ").toUpperCase()}
          />
        ))}

        <button
          type="submit"
          className={`col-span-2 bg-${
            editMode ? "yellow" : "blue"
          }-500 text-white p-2 rounded`}
        >
          {editMode ? "Actualizar Venta" : "Agregar Venta"}
        </button>
      </form>

      <table className="w-full border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Comprador</th>
            <th className="p-2 border">Total Venta (Bs)</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta._id} className="border">
              <td className="p-2 border">{venta.comprador}</td>
              <td className="p-2 border">
                {formatDecimal(venta.total_venta_bs)} Bs
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEditVenta(venta)}
                  className="px-3 py-1 mr-2 text-white bg-yellow-500 rounded"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => deleteVenta(venta._id)}
                  className="px-3 py-1 text-white bg-red-500 rounded"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
