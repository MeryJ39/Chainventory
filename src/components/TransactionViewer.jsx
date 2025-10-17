import { ethers } from "ethers";
import { useState, useEffect } from "react";

const providerUrl =
  "https://json-rpc.3mld1t0b8ajpn9kjru00d8kxs.blockchainnodeengine.com?key=AIzaSyCLFlfiLebKbwrD5F1qKh_KM0-6pYTUZUs";
const provider = new ethers.JsonRpcProvider(providerUrl);

function TransactionViewer() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // La dirección de tu wallet (derivada de la clave privada)
  const walletAddress = "0x742d35Cc6634C0532925a3b8D404d4Cb7c0d1a68"; // Cambia por tu dirección real

  const loadTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      // Obtener el bloque actual
      const currentBlock = await provider.getBlockNumber();
      const registrations = [];

      // Buscar en los últimos 1000 bloques (ajusta según necesites)
      const fromBlock = Math.max(0, currentBlock - 1000);

      for (
        let blockNumber = currentBlock;
        blockNumber >= fromBlock;
        blockNumber--
      ) {
        try {
          const block = await provider.getBlock(blockNumber, true);

          if (block && block.transactions) {
            for (const tx of block.transactions) {
              // Verificar si es una transacción a nuestra dirección con datos
              if (
                tx.to &&
                tx.to.toLowerCase() === walletAddress.toLowerCase() &&
                tx.data &&
                tx.data !== "0x" &&
                tx.value === 0n
              ) {
                try {
                  // Decodificar los datos
                  const decodedData = ethers.toUtf8String(tx.data);
                  const cowData = JSON.parse(decodedData);

                  registrations.push({
                    hash: tx.hash,
                    blockNumber: tx.blockNumber,
                    timestamp: block.timestamp,
                    data: cowData,
                  });
                } catch (decodeError) {
                  // Ignorar transacciones que no se pueden decodificar
                  console.warn(
                    `Error decoding transaction data for ${tx.hash}:`,
                    decodeError
                  );
                }
              }
            }
          }
        } catch (blockError) {
          console.warn(`Error accessing block ${blockNumber}:`, blockError);
        }
      }

      // Ordenar por bloque más reciente primero
      registrations.sort((a, b) => b.blockNumber - a.blockNumber);
      setTransactions(registrations);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Error al cargar las transacciones: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          Registro de Bovinos en Blockchain
        </h2>
        <button
          onClick={loadTransactions}
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="mb-4 text-gray-600">
        Total de registros encontrados: {transactions.length}
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="p-4 bg-white border rounded-lg shadow-sm"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                
              <div>
                <h3 className="mb-2 text-xl font-semibold text-blue-600">
                  {tx.data.name || "Sin nombre"}
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Raza:</span>{" "}
                    {tx.data.breed || "No especificada"}
                  </p>
                  <p>
                    <span className="font-medium">Fecha de nacimiento:</span>{" "}
                    {tx.data.birthDate || "No especificada"}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Hash de transacción:</span>
                </p>
                <p className="font-mono text-xs break-all">{tx.hash}</p>
                <p>
                  <span className="font-medium">Bloque:</span> {tx.blockNumber}
                </p>
                <p>
                  <span className="font-medium">Fecha de registro:</span>{" "}
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && !loading && (
        <div className="py-8 text-center text-gray-500">
          No se encontraron registros de bovinos en los últimos bloques.
        </div>
      )}
    </div>
  );
}

export default TransactionViewer;
