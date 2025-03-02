import web3 from "../utils/web3";
import productoContract from "../utils/contracts/productoContract";
import { N } from "ethers";

// 📌 Función para registrar un producto
export const registrarProducto = async (
  tipo,
  descripcion,
  especie,
  edad,
  raza,
  cantidad,
  movimiento,
  guia,
  autorizacion,
  destino,
  saldo,
  observaciones,
  idAnimal
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await productoContract.methods
      .registrarProducto(
        tipo,
        descripcion,
        especie,
        edad,
        raza,
        cantidad,
        movimiento,
        guia,
        autorizacion,
        destino,
        saldo,
        observaciones,
        idAnimal
      )
      .send({ from: accounts[0] });

    console.log("✅ Producto registrado en blockchain");
  } catch (error) {
    console.error("❌ Error al registrar producto:", error);
  }
};

// 📌 Función para actualizar la información general de un producto
export const actualizarProductoInfo = async (
  id,
  tipo,
  descripcion,
  especie,
  edad,
  raza
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await productoContract.methods
      .actualizarProductoInfo(id, tipo, descripcion, especie, edad, raza)
      .send({ from: accounts[0] });

    console.log(`✅ Información del producto ${id} actualizada`);
  } catch (error) {
    console.error("❌ Error al actualizar información del producto:", error);
  }
};

// 📌 Función para actualizar el inventario de un producto
export const actualizarProductoInventario = async (
  id,
  cantidad,
  movimiento,
  guia,
  autorizacion,
  destino,
  saldo,
  observaciones
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await productoContract.methods
      .actualizarProductoInventario(
        id,
        cantidad,
        movimiento,
        guia,
        autorizacion,
        destino,
        saldo,
        observaciones
      )
      .send({ from: accounts[0] });

    console.log(`✅ Inventario del producto ${id} actualizado`);
  } catch (error) {
    console.error("❌ Error al actualizar inventario del producto:", error);
  }
};

// 📌 Función para eliminar un producto (desactivarlo)
export const eliminarProducto = async (id) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await productoContract.methods
      .eliminarProducto(id)
      .send({ from: accounts[0] });

    console.log(`✅ Producto ${id} eliminado`);
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
  }
};

// 📌 Función para obtener un producto por ID
export const obtenerProducto = async (id) => {
  try {
    const producto = await productoContract.methods.obtenerProducto(id).call();
    return {
      id: Number(producto[0]),
      tipo: producto[1],
      descripcion: producto[2],
      especie: producto[3],
      edad: Number(producto[4]),
      raza: producto[5],
      cantidad: Number(producto[6]),
      activo: producto[7], // Nuevo campo de estado
    };
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    return null;
  }
};

// 📌 Función para listar todos los productos activos
export const listarProductos = async () => {
  try {
    const productos = await productoContract.methods.listarProductos().call();
    return productos.map((producto) => ({
      id: Number(producto.id),
      tipo: producto.tipo,
      descripcion: producto.descripcion,
      especie: producto.especie,
      edad: Number(producto.edad),
      raza: producto.raza,
      cantidad: Number(producto.cantidad),
      activo: producto.activo,

      observaciones: producto.observaciones,
      destino: producto.destino,
      saldo: Number(producto[11]),
    }));
  } catch (error) {
    console.error("❌ Error al listar productos:", error);
    return [];
  }
};
