// src/utils/web3.js

import Web3 from "web3";

// Configuración de la red local de Ganache
const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    const web3 = new Web3("http://127.0.0.1:7545"); // URL de Ganache
    web3.eth
      .getAccounts()
      .then((accounts) => {
        if (accounts.length === 0) {
          reject(
            new Error("No hay cuentas disponibles en la red local de Ganache")
          );
        } else {
          resolve(web3);
        }
      })
      .catch((error) => reject(error));
  });
};

export default getWeb3;
