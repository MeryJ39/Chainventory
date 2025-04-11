import {
  registrarAnimal,
  obtenerAnimal,
  listarAnimales,
  actualizarAnimal,
  retirarAnimal,
  cambiarCategoria,
} from "../services/animalService.js";

// Simulación de window.ethereum y web3
const mockEthereum = {
  request: async ({ method }) => {
    if (method === "eth_requestAccounts") {
      return ["0x123..."]; // Simula la respuesta de las cuentas
    }
    return null;
  },
};

const mockWeb3 = {
  eth: {
    getAccounts: async () => ["0x123..."], // Simula getAccounts
  },
};

// Reemplaza las importaciones reales con los mocks para las pruebas
jest.mock("../utils/web3.js", () => {
  if (typeof window !== "undefined") {
    window.ethereum = mockEthereum;
  }
  return mockWeb3;
});

const animalContract = {
  methods: {
    registrarAnimal: () => ({ send: async () => {} }),
    obtenerAnimal: () => ({
      call: async () => ({
        /* datos de animal de prueba */
      }),
    }),
    listarAnimales: () => ({
      call: async () => [
        {
          /* datos de animal de prueba */
        },
      ],
    }),
    actualizarAnimal: () => ({ send: async () => {} }),
    retirarAnimal: () => ({ send: async () => {} }),
    cambiarCategoria: () => ({ send: async () => {} }),
  },
};

// Reemplaza las importaciones reales con los mocks para las pruebas
jest.mock("../utils/web3.js", () => web3);
jest.mock("../utils/contracts/animalContract.js", () => animalContract);

// Funciones de utilidad para las pruebas
function assertIgual(esperado, obtenido, mensaje) {
  if (esperado === obtenido) {
    console.log(`✅ ${mensaje}: Éxito`);
  } else {
    console.error(
      `❌ ${mensaje}: Fallido. Esperado ${esperado}, obtenido ${obtenido}`
    );
  }
}

async function assertError(funcion, mensaje) {
  try {
    await funcion();
    console.error(`❌ ${mensaje}: Fallido. No se lanzó un error.`);
  } catch (error) {
    console.log(`✅ ${mensaje}: Éxito. Error capturado: ${error.message}`);
  }
}

// Pruebas
async function pruebasAnimalService() {
  console.log("--- Pruebas animalService ---");

  // Prueba registrarAnimal
  await registrarAnimal(
    "ID123",
    "Vaca Lola",
    "Mi Ganadera",
    1678886400,
    3,
    "Ternero",
    "Ternero",
    "Activo"
  );
  console.log("✅ Prueba registrarAnimal completada");

  // Prueba obtenerAnimal
  const animal = await obtenerAnimal(1);
  assertIgual(typeof animal, "object", "Prueba obtenerAnimal");

  // Prueba listarAnimales
  const animales = await listarAnimales();
  assertIgual(Array.isArray(animales), true, "Prueba listarAnimales");

  // Prueba actualizarAnimal
  await actualizarAnimal(1, "Vaca Lola 2", "Otra Ganadera", 4, "Inactivo");
  console.log("✅ Prueba actualizarAnimal completada");

  // Prueba retirarAnimal
  await retirarAnimal(1, "Muerte natural");
  console.log("✅ Prueba retirarAnimal completada");

  // Prueba cambiarCategoria
  await cambiarCategoria(1, "Vaca adulta");
  console.log("✅ Prueba cambiarCategoria completada");

  //Pruebas de errores.
  await assertError(async () => {
    await obtenerAnimal();
  }, "Prueba de error al obtener animal");

  await assertError(async () => {
    await listarAnimales();
  }, "Prueba de error al listar animales");

  await assertError(async () => {
    await registrarAnimal();
  }, "Prueba de error al registrar animales");

  await assertError(async () => {
    await actualizarAnimal();
  }, "Prueba de error al actualizar animales");

  console.log("--- Fin de pruebas animalService ---");
}

pruebasAnimalService();
