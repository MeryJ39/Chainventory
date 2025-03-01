import web3 from "../utils/web3";
import vacunaContract from "../utils/contracts/vacunaContract";

// 📌 Función para registrar una vacuna
export const registrarVacuna = async (
  idHembra,
  especie,
  raza,
  edad,
  tipoVacuna,
  dosis,
  fechaProxima,
  veterinario,
  observaciones,
  idAnimal
) => {
  try {
    const accounts = await web3.eth.getAccounts();

    // 📌 🔥 Convertir fechaProxima a timestamp UNIX
    const fechaProximaTimestamp = Math.floor(
      new Date(fechaProxima).getTime() / 1000
    );

    await vacunaContract.methods
      .registrarVacuna(
        idHembra,
        especie,
        raza,
        edad,
        tipoVacuna,
        dosis,
        fechaProximaTimestamp, // 🔥 Mandamos la fecha como uint256
        veterinario,
        observaciones,
        idAnimal
      )
      .send({ from: accounts[0] });

    console.log("✅ Vacuna registrada en blockchain");
  } catch (error) {
    console.error("❌ Error al registrar vacuna:", error);
  }
};

// 📌 Función para obtener una vacuna por ID
export const obtenerVacuna = async (id) => {
  try {
    const vacuna = await vacunaContract.methods.obtenerVacuna(id).call();
    return {
      idHembra: vacuna[0],
      especie: vacuna[1],
      raza: vacuna[2],
      edad: Number(vacuna[3]),
      tipoVacuna: vacuna[4],
      dosisAdministrada: Number(vacuna[5]),
      fechaProximaDosis: Number(vacuna[6]),
      veterinario: vacuna[7],
      observaciones: vacuna[8],
      idAnimal: Number(vacuna[9]),
      activa: vacuna[10],
    };
  } catch (error) {
    console.error("❌ Error al obtener vacuna:", error);
    return null;
  }
};

// 📌 Función para listar todas las vacunas activas
export const listarVacunas = async () => {
  try {
    const vacunas = await vacunaContract.methods.listarVacunas().call();
    return vacunas.map((vacuna) => ({
      id: Number(vacuna.id),
      idHembra: vacuna.id_hembra,
      especie: vacuna.especie,
      raza: vacuna.raza,
      edad: Number(vacuna.edad),
      tipoVacuna: vacuna.tipo_vacuna,
      dosisAdministrada: Number(vacuna.dosis_administrada),
      fechaProximaDosis: Number(vacuna.fecha_proxima_dosis),
      veterinario: vacuna.veterinario,
      observaciones: vacuna.observaciones,
      idAnimal: Number(vacuna.id_animal),
      activa: vacuna.activa,
    }));
  } catch (error) {
    console.error("❌ Error al listar vacunas:", error);
    return [];
  }
};

// 📌 Función para listar vacunas aplicadas a un animal
export const listarVacunasPorAnimal = async (idAnimal) => {
  try {
    const vacunas = await vacunaContract.methods
      .listarVacunasPorAnimal(idAnimal)
      .call();

    return vacunas.map((vacuna) => ({
      id: Number(vacuna.id),
      idHembra: vacuna.id_hembra,
      especie: vacuna.especie,
      raza: vacuna.raza,
      edad: Number(vacuna.edad),
      tipoVacuna: vacuna.tipo_vacuna,
      dosisAdministrada: Number(vacuna.dosis_administrada),
      fechaProximaDosis: Number(vacuna.fecha_proxima_dosis),
      veterinario: vacuna.veterinario,
      observaciones: vacuna.observaciones,
      idAnimal: Number(vacuna.id_animal),
      activa: vacuna.activa,
    }));
  } catch (error) {
    console.error("❌ Error al listar vacunas del animal:", error);
    return [];
  }
};

// 📌 Función para actualizar una vacuna
export const actualizarVacuna = async (
  id,
  idHembra,
  especie,
  raza,
  edad,
  tipoVacuna,
  dosis,
  fechaProxima,
  veterinario,
  observaciones
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await vacunaContract.methods
      .actualizarVacuna(
        id,
        idHembra,
        especie,
        raza,
        edad,
        tipoVacuna,
        dosis,
        fechaProxima,
        veterinario,
        observaciones
      )
      .send({ from: accounts[0] });

    console.log(`✅ Vacuna ${id} actualizada con éxito`);
  } catch (error) {
    console.error("❌ Error al actualizar vacuna:", error);
  }
};

// 📌 Función para eliminar (desactivar) una vacuna
export const eliminarVacuna = async (id) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await vacunaContract.methods.eliminarVacuna(id).send({ from: accounts[0] });

    console.log(`✅ Vacuna ${id} eliminada con éxito`);
  } catch (error) {
    console.error("❌ Error al eliminar vacuna:", error);
  }
};
