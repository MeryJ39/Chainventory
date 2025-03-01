import React, { useState, useEffect } from "react";
import {
  listarVentas,
  registrarVenta,
  actualizarVenta,
  eliminarVenta,
} from "../services/ventaService";
import { listarAnimales } from "../services/animalService"; // 🔥 Importamos el servicio de animales

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [animales, setAnimales] = useState([]); // 📌 Lista de animales para el select
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [editMode, setEditMode] = useState(false);
  const [ventaId, setVentaId] = useState(null);

  // 📌 Cargar las ventas y animales desde la blockchain al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listaVentas = await listarVentas();
        const listaAnimales = await listarAnimales(); // 🔥 Cargamos los animales disponibles
        setVentas(listaVentas);
        setAnimales(listaAnimales); // 🔥 Guardamos los animales en el estado
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        setError("Error al cargar datos.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 📌 Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Manejar cambio en el `select` de animales
  const handleAnimalChange = (e) => {
    setFormData({ ...formData, idAnimal: e.target.value });
  };

  // 📌 Formatear valores numéricos
  const formatDecimal = (value) => (Number(value) || 0).toFixed(2);

  // 📌 Formatear datos antes de enviar
  const formatFormData = (data) => ({
    ...data,
    cantidad: Number(data.cantidad) || 0,
    precioUnitario: Number(data.precioUnitario) || 0,
    totalBs: Number(data.totalBs) || 0,
    totalUsd: Number(data.totalUsd) || 0,
    cantidadDia: Number(data.cantidadDia) || 0,
    idAnimal: Number(data.idAnimal) || 0,
  });

  // 📌 Registrar una nueva venta
  const handleCreateVenta = async (e) => {
    e.preventDefault();
    try {
      await registrarVenta(...Object.values(formatFormData(formData)));
      alert("✅ Venta registrada con éxito");
      setVentas(await listarVentas());
      resetForm();
    } catch (error) {
      alert("❌ Error al registrar la venta");
      console.error("Error al registrar venta:", error);
    }
  };

  // 📌 Cargar datos de una venta para edición
  const handleEditVenta = (venta) => {
    setEditMode(true);
    setVentaId(venta.id);
    setFormData({ ...venta });
  };

  // 📌 Actualizar una venta existente
  const handleUpdateVenta = async (e) => {
    e.preventDefault();
    try {
      await actualizarVenta(
        ventaId,
        ...Object.values(formatFormData(formData))
      );
      alert("✅ Venta actualizada con éxito");
      setEditMode(false);
      setVentaId(null);
      setVentas(await listarVentas());
      resetForm();
    } catch (error) {
      alert("❌ Error al actualizar la venta");
      console.error("Error al actualizar venta:", error);
    }
  };

  // 📌 Eliminar una venta
  const handleDeleteVenta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      try {
        await eliminarVenta(id);
        alert("✅ Venta eliminada con éxito");
        setVentas(await listarVentas());
      } catch (error) {
        alert("❌ Error al eliminar la venta");
        console.error("Error al eliminar venta:", error);
      }
    }
  };

  // 📌 Resetear el formulario
  const resetForm = () => {
    setFormData(initialFormState);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-background">
      <h2 className="mb-4 text-2xl font-bold">Gestión de Ventas</h2>

      {loading && <p className="text-blue-500">Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={editMode ? handleUpdateVenta : handleCreateVenta}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {Object.keys(initialFormState).map((key) =>
          key === "idAnimal" ? (
            // 📌 Agregamos el `select` para elegir un animal
            <select
              key={key}
              name={key}
              value={formData[key]}
              onChange={handleAnimalChange}
              className="p-2 border border-gray-400 rounded bg-background text-text"
            >
              <option value="">Seleccionar un animal</option>
              {animales.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nombre} (ID: {animal.id})
                </option>
              ))}
            </select>
          ) : (
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
              placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
            />
          )
        )}

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
          {ventas.length > 0 ? (
            ventas.map((venta) => (
              <tr key={venta.id} className="border">
                <td className="p-2 border">{venta.comprador}</td>
                <td className="p-2 border">
                  {formatDecimal(venta.totalBs)} Bs
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditVenta(venta)}
                    className="px-3 py-1 mr-2 text-white bg-yellow-500 rounded"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteVenta(venta.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">
                No hay ventas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
