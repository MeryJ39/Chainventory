import web3 from "../utils/web3";
import usuarioContract from "../utils/contracts/usuarioContract";

// 📌 Función para registrar un usuario (Solo el administrador puede hacerlo)
export const registrarUsuario = async (username, password, rol) => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    await usuarioContract.methods
      .registrarUsuario(username, password, rol)
      .send({ from: accounts[0] });

    console.log(`✅ Usuario ${username} registrado con éxito`);
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
  }
};

// 📌 Función para validar usuario (Login)
export const validarUsuario = async (username, password) => {
  try {
    const resultado = await usuarioContract.methods
      .validarUsuario(username, password)
      .call();

    console.log("📢 Respuesta del contrato:", resultado);

    const existe = resultado[0];
    const rol = resultado[1];

    if (!existe) {
      console.error(`❌ Error en login: ${rol}`);
      return { success: false, message: rol };
    }

    // 📌 Ahora obtenemos los datos completos del usuario
    const usuario = await usuarioContract.methods
      .obtenerUsuario(username)
      .call();

    const usuarioData = {
      username: usuario[0],
      rol: usuario[1],
      activo: usuario[2],
    };

    console.log("✅ Usuario autenticado:", usuarioData);
    return { success: true, usuario: usuarioData };
  } catch (error) {
    console.error("❌ Error al validar usuario en blockchain:", error);
    return { success: false, message: "Error en la autenticación" };
  }
};

// 📌 Función para cambiar la contraseña de un usuario (Solo el administrador)
export const cambiarContraseña = async (username, nuevaPassword) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await usuarioContract.methods
      .cambiarContraseña(username, nuevaPassword)
      .send({ from: accounts[0] });

    console.log(`✅ Contraseña de ${username} cambiada con éxito`);
  } catch (error) {
    console.error("❌ Error al cambiar la contraseña:", error);
  }
};

// 📌 Función para cambiar el rol de un usuario (Solo el administrador)
export const cambiarRol = async (username, nuevoRol) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await usuarioContract.methods
      .cambiarRol(username, nuevoRol)
      .send({ from: accounts[0] });

    console.log(`✅ Rol de ${username} cambiado a ${nuevoRol}`);
  } catch (error) {
    console.error("❌ Error al cambiar el rol:", error);
  }
};

// 📌 Función para eliminar (desactivar) un usuario (Solo el administrador)
export const eliminarUsuario = async (username) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await usuarioContract.methods
      .eliminarUsuario(username)
      .send({ from: accounts[0] });

    console.log(`✅ Usuario ${username} desactivado`);
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
  }
};

// 📌 Función para obtener datos de un usuario por nombre
export const obtenerUsuario = async (username) => {
  try {
    const usuario = await usuarioContract.methods
      .obtenerUsuario(username)
      .call();
    return {
      username: usuario[0],
      rol: usuario[1],
      activo: usuario[2],
    };
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return null;
  }
};

// 📌 Función para listar todos los usuarios (Solo el administrador)
export const listarUsuarios = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const usuarios = await usuarioContract.methods
      .listarUsuarios()
      .call({ from: accounts[0] });

    return usuarios.map((usuario) => ({
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      activo: usuario.activo,
    }));
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    return [];
  }
};
