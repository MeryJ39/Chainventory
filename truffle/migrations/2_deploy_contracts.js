const UsuarioContract = artifacts.require("UsuarioContract");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(UsuarioContract);
  const usuarioInstance = await UsuarioContract.deployed();

  // 📌 Agregar usuarios por defecto
  await usuarioInstance.registrarUsuario("admin", "admin123", "administrador", {
    from: accounts[0],
  });
  await usuarioInstance.registrarUsuario("user1", "password", "usuario", {
    from: accounts[0],
  });

  console.log("✅ Usuarios inicializados en la blockchain.");
};
