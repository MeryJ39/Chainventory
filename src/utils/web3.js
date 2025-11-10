import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Solicitar acceso a la cuenta del usuario
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error("Acceso a la cuenta de MetaMask rechazado", error);
  }
} else {
  console.warn("MetaMask no está instalado. Se recomienda instalarlo.");
}

export default web3;


