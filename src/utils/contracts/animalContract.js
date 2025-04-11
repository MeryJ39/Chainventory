import web3 from "../web3.js";
import AnimalContractABI from "../../../truffle/contracts/AnimalContract.json" assert { type: "json" };

const networkId = Object.keys(AnimalContractABI.networks)[0];
console.log("networkId", networkId);
const contractAddress = AnimalContractABI.networks[networkId]?.address;
console.log("contractAddress", contractAddress);

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const animalContract = new web3.eth.Contract(
  AnimalContractABI.abi,
  contractAddress
);

export default animalContract;
