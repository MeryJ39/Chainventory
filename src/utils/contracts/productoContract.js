import web3 from "../web3";
import ProductoContractABI from "../../../truffle/contracts/ProductoContract.json";

const networkId = Object.keys(ProductoContractABI.networks)[0];
const contractAddress = ProductoContractABI.networks[networkId]?.address;

if (!contractAddress) {
  console.error("⚠️ No se encontró la dirección del contrato.");
}

const productoContract = new web3.eth.Contract(
  ProductoContractABI.abi,
  contractAddress
);

export default productoContract;
