const ProductoContract = artifacts.require("ProductoContract");
const VentaContract = artifacts.require("VentaContract");
const AnimalContract = artifacts.require("AnimalContract");
const VacunaContract = artifacts.require("VacunaContract");
const UsuarioContract = artifacts.require("UsuarioContract");
const GanaderiaInventario = artifacts.require("GanaderiaInventario");

module.exports = async function (deployer) {
  // 1️⃣ Desplegar contratos individuales
  await deployer.deploy(ProductoContract);
  const productoInstance = await ProductoContract.deployed();

  await deployer.deploy(VentaContract);
  const ventaInstance = await VentaContract.deployed();

  await deployer.deploy(AnimalContract);
  const animalInstance = await AnimalContract.deployed();

  await deployer.deploy(VacunaContract);
  const vacunaInstance = await VacunaContract.deployed();

  await deployer.deploy(UsuarioContract);
  const usuarioInstance = await UsuarioContract.deployed();

  // 2️⃣ Desplegar GanaderiaInventario PASANDO LOS PARÁMETROS CORRECTOS
  await deployer.deploy(
    GanaderiaInventario,
    productoInstance.address,
    ventaInstance.address,
    animalInstance.address,
    vacunaInstance.address,
    usuarioInstance.address
  );
};
