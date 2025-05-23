import { ethers } from "ethers";

// Tu endpoint del nodo Sepolia de Blockchain Node Engine
const RPC_URL =
  "https://json-rpc.7ho40m7mw5bl29ce988fvqjvn.blockchainnodeengine.com";

// Crea el proveedor
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
async function testConnection() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conexión exitosa. Bloque actual:", blockNumber);
  } catch (err) {
    console.error("❌ Error al conectar con el nodo:", err);
  }
}

testConnection();
