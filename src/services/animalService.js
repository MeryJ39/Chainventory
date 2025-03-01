import web3 from "../utils/web3";
import animalContract from "../utils/contracts/animalContract";

// 📌 Función para registrar un animal
export const registrarAnimal = async (
  idHembra,
  nombre,
  ganadera,
  fechaNacimiento,
  edad,
  categoriaIngreso,
  categoriaActual,
  estatus
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await animalContract.methods
      .registrarAnimal(
        idHembra,
        nombre,
        ganadera,
        fechaNacimiento,
        edad,
        categoriaIngreso,
        categoriaActual,
        estatus
      )
      .send({ from: accounts[0] });

    console.log(`✅ Animal "${nombre}" registrado en blockchain`);
  } catch (error) {
    console.error("❌ Error al registrar animal:", error);
  }
};

// 📌 Función para obtener un animal por ID
export const obtenerAnimal = async (id) => {
  try {
    const animal = await animalContract.methods.obtenerAnimal(id).call();

    return {
      idHembra: animal[0],
      nombre: animal[1],
      ganadera: animal[2],
      fechaIngreso: Number(animal[3]),
      fechaNacimiento: Number(animal[4]),
      edad: Number(animal[5]),
      categoriaIngreso: animal[6],
      categoriaActual: animal[7],
      estatus: animal[8],
      fechaRetiro: Number(animal[9]),
      causaMortalidad: animal[10],
    };
  } catch (error) {
    console.error("❌ Error al obtener animal:", error);
    return null;
  }
};

// 📌 Función para listar todos los animales
export const listarAnimales = async () => {
  try {
    const animales = await animalContract.methods.listarAnimales().call();

    return animales.map((animal) => ({
      id: Number(animal.id),
      idHembra: animal.id_hembra,
      nombre: animal.nombre,
      ganadera: animal.ganadera,
      fechaIngreso: Number(animal.fecha_ingreso),
      fechaNacimiento: Number(animal.fecha_nacimiento),
      edad: Number(animal.edad),
      categoriaIngreso: animal.categoria_ingreso,
      categoriaActual: animal.categoria_actual,
      estatus: animal.estatus,
      fechaRetiro: Number(animal.fecha_retiro),
      causaMortalidad: animal.causa_mortalidad,
    }));
  } catch (error) {
    console.error("❌ Error al listar animales:", error);
    return [];
  }
};

// 📌 Función para actualizar un animal
export const actualizarAnimal = async (id, nombre, ganadera, edad, estatus) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await animalContract.methods
      .actualizarAnimal(id, nombre, ganadera, edad, estatus)
      .send({ from: accounts[0] });

    console.log(`✅ Animal ${id} actualizado con éxito`);
  } catch (error) {
    console.error("❌ Error al actualizar animal:", error);
  }
};

// 📌 Función para retirar un animal
export const retirarAnimal = async (id, causa) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await animalContract.methods
      .retirarAnimal(id, causa)
      .send({ from: accounts[0] });

    console.log(`✅ Animal ${id} retirado con éxito`);
  } catch (error) {
    console.error("❌ Error al retirar animal:", error);
  }
};

// 📌 Función para cambiar la categoría de un animal
export const cambiarCategoria = async (id, nuevaCategoria) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await animalContract.methods
      .cambiarCategoria(id, nuevaCategoria)
      .send({ from: accounts[0] });

    console.log(`✅ Categoría del animal ${id} cambiada a ${nuevaCategoria}`);
  } catch (error) {
    console.error("❌ Error al cambiar categoría:", error);
  }
};
