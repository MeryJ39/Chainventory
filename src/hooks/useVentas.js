import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/ventas";

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las ventas
  const fetchVentas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener las ventas");
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una venta por ID
  const fetchVentaById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Error al obtener la venta");
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Crear una nueva venta
  const createVenta = async (nuevaVenta) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaVenta),
      });
      if (!response.ok) throw new Error("Error al crear la venta");
      const data = await response.json();
      setVentas([...ventas, data]);
    } catch (error) {
      setError(error.message);
    }
  };

  // Actualizar una venta existente
  const updateVenta = async (id, ventaActualizada) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaActualizada),
      });
      if (!response.ok) throw new Error("Error al actualizar la venta");
      const data = await response.json();
      setVentas(ventas.map((venta) => (venta._id === id ? data : venta)));
    } catch (error) {
      setError(error.message);
    }
  };

  // Eliminar una venta
  const deleteVenta = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar la venta");
      setVentas(ventas.filter((venta) => venta._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return {
    ventas,
    loading,
    error,
    fetchVentaById,
    createVenta,
    updateVenta,
    deleteVenta,
  };
};

export default useVentas;
