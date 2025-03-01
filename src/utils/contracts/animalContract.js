import web3 from "../web3";
import AnimalContractABI from "../../../truffle/contracts/AnimalContract.json";

const networkId = Object.keys(AnimalContractABI.networks)[0];
const contractAddress = AnimalContractABI.networks[networkId]?.address;

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const animalContract = new web3.eth.Contract(
  AnimalContractABI.abi,
  contractAddress
);

export default animalContract;
