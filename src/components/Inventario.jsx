import web3 from "../utils/web3"; // Importa getWeb3 desde la ubicación correcta
import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react"; // Importa los componentes de Material Tailwind

const Inventario = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card color="transparent" shadow={false} className="p-6 w-96">
        <Typography variant="h4" color="blue-gray" className="mb-6 text-center">
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
