import web3 from "../utils/web3";
import ventaContract from "../utils/contracts/ventaContract";

// 📌 Función para registrar una venta
export const registrarVenta = async (
  comprador,
  propiedad,
  cantidad,
  gma,
  clase,
  precioUnitario,
  totalBs,
  totalUsd,
  observacion,
  cantidadDia,
  idAnimal
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await ventaContract.methods
      .registrarVenta(
        comprador,
        propiedad,
        cantidad,
        gma,
        clase,
        precioUnitario,
        totalBs,
        totalUsd,
        observacion,
        cantidadDia,
        idAnimal
      )
      .send({ from: accounts[0] });

    console.log(`✅ Venta registrada para ${comprador}`);
  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
  }
};

// 📌 Función para obtener una venta por ID
export const obtenerVenta = async (id) => {
  try {
    const venta = await ventaContract.methods.obtenerVenta(id).call();

    return {
      comprador: venta[0],
      propiedad: venta[1],
      cantidad: Number(venta[2]),
      gma: venta[3],
      clase: venta[4],
      precioUnitario: Number(venta[5]),
      totalBs: Number(venta[6]),
      totalUsd: Number(venta[7]),
      observacion: venta[8],
      cantidadDia: Number(venta[9]),
      idAnimal: Number(venta[10]),
      fechaVenta: Number(venta[11]),
      activa: venta[12], // Indica si la venta está activa o eliminada
    };
  } catch (error) {
    console.error("❌ Error al obtener venta:", error);
    return null;
  }
};

// 📌 Función para listar todas las ventas activas
export const listarVentas = async () => {
  try {
    const ventas = await ventaContract.methods.listarVentas().call();

    return ventas.map((venta) => ({
      id: Number(venta.id),
      comprador: venta.comprador,
      propiedad: venta.propiedad,
      cantidad: Number(venta.cantidad),
      gma: venta.gma,
      clase: venta.clase,
      precioUnitario: Number(venta.precio_unitario),
      totalBs: Number(venta.total_venta_bs),
      totalUsd: Number(venta.total_venta_usd),
      observacion: venta.observacion,
      cantidadDia: Number(venta.cantidad_dia),
      idAnimal: Number(venta.id_animal),
      fechaVenta: Number(venta.fecha_venta),
      activa: venta.activa,
    }));
  } catch (error) {
    console.error("❌ Error al listar ventas:", error);
    return [];
  }
};

// 📌 Función para actualizar una venta
export const actualizarVenta = async (
  id,
  comprador,
  propiedad,
  cantidad,
  gma,
  clase,
  precioUnitario,
  totalBs,
  totalUsd,
  observacion,
  cantidadDia
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await ventaContract.methods
      .actualizarVenta(
        id,
        comprador,
        propiedad,
        cantidad,
        gma,
        clase,
        precioUnitario,
        totalBs,
        totalUsd,
        observacion,
        cantidadDia
      )
      .send({ from: accounts[0] });

    console.log(`✅ Venta ${id} actualizada con éxito`);
  } catch (error) {
    console.error("❌ Error al actualizar venta:", error);
  }
};

// 📌 Función para eliminar una venta (marcarla como inactiva)
export const eliminarVenta = async (id) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await ventaContract.methods.eliminarVenta(id).send({ from: accounts[0] });

    console.log(`✅ Venta ${id} eliminada con éxito`);
  } catch (error) {
    console.error("❌ Error al eliminar venta:", error);
  }
};
