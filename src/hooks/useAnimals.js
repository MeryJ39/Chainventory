import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/animals";

export const useAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los animales
  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setAnimals(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo animal
  const addAnimal = async (animalData) => {
    try {
      const response = await axios.post(API_URL, animalData);
      setAnimals([...animals, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Actualizar un animal
  const updateAnimal = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setAnimals(
        animals.map((animal) => (animal._id === id ? response.data : animal))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar un animal
  const deleteAnimal = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAnimals(animals.filter((animal) => animal._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return {
    animals,
    loading,
    error,
    fetchAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
  };
};
