import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/vaccinations";

const useVaccinations = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setVaccinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVaccination = async (vaccination) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vaccination),
      });
      const newVaccination = await response.json();
      setVaccinations([...vaccinations, newVaccination]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateVaccination = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const updatedVaccination = await response.json();
      setVaccinations(
        vaccinations.map((v) => (v.id_vacuna === id ? updatedVaccination : v))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteVaccination = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setVaccinations(vaccinations.filter((v) => v.id_vacuna !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    vaccinations,
    loading,
    error,
    fetchVaccinations,
    addVaccination,
    updateVaccination,
    deleteVaccination,
  };
};

export default useVaccinations;
