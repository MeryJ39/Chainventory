import getWeb3 from "../utils/web3"; // Importa getWeb3 desde la ubicación correcta
import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import { Card, Input, Button, Typography } from "@material-tailwind/react"; // Importa los componentes de Material Tailwind

const Inventario = () => {
  const [productoNombre, setProductoNombre] = useState("");
  const [productoCantidad, setProductoCantidad] = useState(0);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    // Cargar la cuenta actual
    const loadAccount = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    loadAccount();
  }, []);

  // Función para registrar un nuevo producto
  const registrarProducto = async () => {
    try {
      setLoading(true); // Inicia el loading
      const contract = await getContract();
      const web3 = await getWeb3();

      // Estimamos el gas necesario para la transacción
      const gas = await contract.methods
        .registrarProducto(productoNombre, productoCantidad)
        .estimateGas({ from: account });

      // Ejecutamos la transacción con el gas estimado
      await contract.methods
        .registrarProducto(productoNombre, productoCantidad)
        .send({ from: account, gas })
        .on("transactionHash", (hash) => {
          console.log("Hash de la transacción:", hash); // Puedes hacer algo con el hash
        })
        .on("receipt", (receipt) => {
          console.log("Recibo de la transacción:", receipt); // Ver recibo de la transacción
          alert("Producto registrado!");
        })
        .on("error", (error) => {
          console.error("Error en la transacción:", error);
          alert("Error al registrar el producto.");
        });
    } catch (error) {
      console.error("Error al registrar el producto:", error);
      alert("Ocurrió un error al registrar el producto.");
    } finally {
      setLoading(false); // Detiene el loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card color="transparent" shadow={false} className="w-96 p-6">
        <Typography variant="h4" color="blue-gray" className="text-center mb-6">
          Registrar Producto
        </Typography>

        <form className="mt-4">
          <div className="flex flex-col gap-6">
            {/* Input para el nombre del producto */}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Nombre del Producto
            </Typography>
            <Input
              size="lg"
              placeholder="Nombre del Producto"
              value={productoNombre}
              onChange={(e) => setProductoNombre(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

            {/* Input para la cantidad */}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Cantidad
            </Typography>
            <Input
              type="number"
              size="lg"
              placeholder="Cantidad"
              value={productoCantidad}
              onChange={(e) => setProductoCantidad(Number(e.target.value))}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          {/* Botón para registrar el producto */}
          <Button
            onClick={registrarProducto}
            className={`mt-6 w-full ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
            fullWidth
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Producto"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Inventario;
