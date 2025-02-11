import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/vaccinations"; // Ajusta según tu backend

export const useVaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccination, setVaccination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las vacunaciones
  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener las vacunaciones");
      const data = await response.json();
      setVaccinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una vacunación por ID
  const fetchVaccinationById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Vacunación no encontrada");
      const data = await response.json();
      setVaccination(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva vacunación
  const createVaccination = async (vaccinationData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vaccinationData),
      });
      if (!response.ok) throw new Error("Error al crear la vacunación");
      await fetchVaccinations(); // Actualiza la lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una vacunación
  const updateVaccination = async (id, vaccinationData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vaccinationData),
      });
      if (!response.ok) throw new Error("Error al actualizar la vacunación");
      await fetchVaccinations(); // Actualiza la lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una vacunación
  const deleteVaccination = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar la vacunación");
      await fetchVaccinations(); // Actualiza la lista
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar vacunaciones al montar el hook
  useEffect(() => {
    fetchVaccinations();
  }, []);

  return {
    vaccinations,
    vaccination,
    loading,
    error,
    fetchVaccinations,
    fetchVaccinationById,
    createVaccination,
    updateVaccination,
    deleteVaccination,
  };
};
