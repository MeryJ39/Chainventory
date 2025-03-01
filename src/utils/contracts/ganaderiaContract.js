// src/utils/contract.js
import web3 from "./web3";
// Importa el ABI desde el archivo JSON generado por Truffle
import GanaderiaInventarioABI from "../../truffle/contracts/GanaderiaInventario.json"; // Asegúrate de que el path sea correcto

const networkId = Object.keys(GanaderiaInventarioABI.networks)[0]; // Obtiene la primera red disponible

// Dirección del contrato desplegado en Ganache (o la red que estés usando)
console.log(networkId);
const contractAddress = GanaderiaInventarioABI.networks[networkId]?.address; // Dirección del contrato

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const contract = new web3.eth.Contract(
  GanaderiaInventarioABI.abi,
  contractAddress
);

export default contract;
