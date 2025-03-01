import web3 from "../web3";
import VacunaContractABI from "../../../truffle/contracts/VacunaContract.json";

const networkId = Object.keys(VacunaContractABI.networks)[0];
const contractAddress = VacunaContractABI.networks[networkId]?.address;

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const vacunaContract = new web3.eth.Contract(
  VacunaContractABI.abi,
  contractAddress
);

export default vacunaContract;
