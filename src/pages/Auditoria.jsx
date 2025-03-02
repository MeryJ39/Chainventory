//Registro de acciones realizadas en el sistema.
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import usuarioContract from "../utils/contracts/usuarioContract";
import ventaContract from "../utils/contracts/ventaContract";
import productoContract from "../utils/contracts/productoContract";

const Auditoria = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);

    usuarioContract.events.UsuarioRegistrado({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Usuario",
            detalle: `👤 ${event.returnValues.username} registrado.`,
          },
        ]);
      }
    });

    ventaContract.events.VentaRegistrada({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Venta",
            detalle: `🛒 Venta de ${event.returnValues.cantidad} unidades realizada.`,
          },
        ]);
      }
    });

    productoContract.events.ProductoRegistrado({}, (error, event) => {
      if (!error) {
        setEventos((prev) => [
          ...prev,
          {
            tipo: "Producto",
            detalle: `📦 Producto ${event.returnValues.tipo} agregado.`,
          },
        ]);
      }
    });
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">🔍 Registro de Auditoría</h2>
      <ul className="mt-4 space-y-2">
        {eventos.map((evento, index) => (
          <li key={index} className="p-2 border rounded">
            {evento.detalle}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Auditoria;
