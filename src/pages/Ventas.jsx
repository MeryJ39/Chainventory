import { useState, useEffect } from "react";
import {
  listarVentas,
  registrarVenta,
  actualizarVenta,
  eliminarVenta,
} from "../services/ventaService";
import { listarAnimales } from "../services/animalService";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [animales, setAnimales] = useState([]);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnimalChange = (e) => {
    setFormData({ ...formData, idAnimal: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await actualizarVenta(ventaId, ...Object.values(formData));
        alert("✅ Venta actualizada con éxito");
      } else {
        await registrarVenta(...Object.values(formData));
        alert("✅ Venta registrada con éxito");
      }
      setVentas(await listarVentas());
      resetForm();
    } catch (error) {
      alert("❌ Error al guardar la venta: " + error.message);
    }
  };

  const handleEditVenta = (venta) => {
    setEditMode(true);
    setVentaId(venta.id);
    setFormData({ ...venta });
  };

  const handleDeleteVenta = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      await eliminarVenta(id);
      setVentas(await listarVentas());
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditMode(false);
    setVentaId(null);
  };

  return (
    <div className="max-w-5xl mx-auto rounded-lg bg-background text-text">
      <h2 className="my-6 text-3xl font-bold ">Gestión de Ventas</h2>

      {loading && <p className="text-center text-primary">Cargando datos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🔹 Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 p-6 rounded-lg md:grid-cols-2 bg-background"
      >
        {Object.keys(initialFormState).map((key) =>
          key === "idAnimal" ? (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium text-text">
                Selecciona un animal
              </label>
              <select
                name={key}
                value={formData[key]}
                onChange={handleAnimalChange}
                className="w-full p-2 border border-gray-300 rounded bg-background text-text"
              >
                <option value="">Seleccionar</option>
                {animales.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nombre} (ID: {animal.id})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium capitalize text-text">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  key.includes("fecha") ||
                  key.includes("cantidad") ||
                  key.includes("precio")
                    ? "number"
                    : "text"
                }
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded bg-background text-text"
              />
            </div>
          )
        )}

        <div className="flex justify-end mt-4 md:col-span-2">
          <button
            type="submit"
            className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-opacity-90"
          >
            {editMode ? "Actualizar Venta" : "Agregar Venta"}
          </button>
        </div>
      </form>

      {/* 🔹 Tabla de Ventas */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="text-white bg-secondary">
              <th className="p-3 text-left">Comprador</th>
              <th className="p-3 text-left">Total (Bs)</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <tr key={venta.id} className="border-b">
                  <td className="p-3">{venta.comprador}</td>
                  <td className="p-3">{Number(venta.totalBs).toFixed(2)} Bs</td>
                  <td className="flex gap-2 p-3 ">
                    <button
                      onClick={() => handleEditVenta(venta)}
                      className="flex px-4 py-1 text-white rounded bg-accent hover:bg-opacity-80"
                    >
                      <PencilIcon className="h-5 mr-1"></PencilIcon> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteVenta(venta.id)}
                      className="flex px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <TrashIcon className="h-5 mr-1"></TrashIcon> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
