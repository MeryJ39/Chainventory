const SimpleStorage = artifacts.require("SimpleStorage");
const Inventario = artifacts.require("Inventario");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Inventario);
};
