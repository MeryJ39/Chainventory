//useMovements
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/movements"; // Ajusta la URL según tu backend

export const useInventoryMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los movimientos
  const fetchMovements = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los movimientos");
      const data = await response.json();
      setMovements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear un movimiento
  const createMovement = async (movement) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movement),
      });
      if (!response.ok) throw new Error("Error al crear el movimiento");
      const newMovement = await response.json();
      setMovements((prev) => [...prev, newMovement]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un movimiento
  const updateMovement = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Error al actualizar el movimiento");
      const updatedMovement = await response.json();
      setMovements((prev) =>
        prev.map((mov) => (mov._id === id ? updatedMovement : mov))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un movimiento
  const deleteMovement = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar el movimiento");
      setMovements((prev) => prev.filter((mov) => mov._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return {
    movements,
    loading,
    error,
    createMovement,
    updateMovement,
    deleteMovement,
    fetchMovements,
  };
};
