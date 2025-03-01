import web3 from "../web3";
import VentaContractABI from "../../../truffle/contracts/VentaContract.json";

const networkId = Object.keys(VentaContractABI.networks)[0];
const contractAddress = VentaContractABI.networks[networkId]?.address;

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const ventaContract = new web3.eth.Contract(
  VentaContractABI.abi,
  contractAddress
);

export default ventaContract;
