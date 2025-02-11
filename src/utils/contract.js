// src/utils/contract.js

import getWeb3 from "./web3";

// Importa el ABI desde el archivo JSON generado por Truffle
import InventarioABI from "../../truffle/contracts/Inventario.json"; // Asegúrate de que el path sea correcto

// Dirección del contrato desplegado en Ganache (o la red que estés usando)
const contractAddress = InventarioABI.networks["5777"].address; // 5777 es la red de Ganache por defecto

export const getContract = async () => {
  const web3 = await getWeb3(); // Obtén la instancia de Web3
  const contract = new web3.eth.Contract(InventarioABI.abi, contractAddress); // Crea la instancia del contrato
  return contract;
};
