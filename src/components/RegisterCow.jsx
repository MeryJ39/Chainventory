import { ethers } from "ethers";
import { useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import TransactionViewer from "./TransactionViewer";

const providerUrl =
  "https://json-rpc.3mld1t0b8ajpn9kjru00d8kxs.blockchainnodeengine.com?key=AIzaSyCLFlfiLebKbwrD5F1qKh_KM0-6pYTUZUs";
const provider = new ethers.JsonRpcProvider(providerUrl);

// ⏳ Función para esperar el receipt con reintentos
async function waitForTransactionWithRetry(
  provider,
  txHash,
  retries = 20,
  delay = 1500
) {
  for (let i = 0; i < retries; i++) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt && receipt.blockNumber) {
        return receipt;
      }
    } catch (err) {
      if (!err.message.includes("indexing is in progress")) {
        throw err;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("⏰ Timeout esperando el índice de la transacción");
}

function RegisterCow({ onRegister }) {
  const [cow, setCow] = useState({ name: "", breed: "", birthDate: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setCow({ ...cow, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setStatus("⏳ Enviando transacción...");
      const privateKey =
        "e761dfec18fd54a4a5ea4de01bdc903aa1761b1fdf70dbdb4a024f61aeffeb8d"; // ⚠️ Testnet key, usa solo para pruebas
      const wallet = new ethers.Wallet(privateKey, provider);
      const data = ethers.toUtf8Bytes(JSON.stringify(cow));
      const tx = await wallet.sendTransaction({
        to: wallet.address,
        value: 0,
        data: ethers.hexlify(data),
      });
      setStatus(`📤 Transacción enviada: ${tx.hash}`);
      // Esperamos a que el nodo indexe la transacción
      await waitForTransactionWithRetry(provider, tx.hash);
      setStatus(`✅ Transacción confirmada: ${tx.hash}`);
      onRegister(); // Refresca la lista
    } catch (error) {
      console.error("❌ Error:", error);
      setStatus("❌ Error al enviar la transacción");
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mb-8 rounded-md shadow-md bg-background">
      <h2 className="mb-4 text-2xl font-semibold text-center">
        Registrar Bovino
      </h2>

      <div className="mb-4">
        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="mb-4">
        <input
          name="breed"
          placeholder="Raza"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="mb-4">
        <input
          name="birthDate"
          type="date"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 transition duration-300 bg-blue-500 rounded-md text-text hover:bg-blue-600"
      >
        Registrar
      </button>

      <p className="mt-4 text-center">{status}</p>
      {/*<TransactionViewer />*/}
    </div>
  );
}

RegisterCow.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegisterCow;
