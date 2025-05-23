// blockchain.js
import {ethers} from "ethers";

export const getProvider = () => {
  const RPC_URL =
    "https://json-rpc.dyhbelsmtc7ro3o07nsxb51lm.blockchainnodeengine.com";
   
  console.log("RPC_URL", RPC_URL);  

  return new ethers.JsonRpcProvider(RPC_URL);
};

export const getWallet = () => {
  const PRIVATE_KEY =
    "1a3c8a07f29889cca9cde18c6083c942db8c5050aba9f33e39b98a0b0e3eafcc";
  // ⚠️ Testnet key, usa solo para pruebas
  return new ethers.Wallet(PRIVATE_KEY, getProvider());
};

export const sendCowTransaction = async (cowData) => {
  const wallet = getWallet();
  const dataString = JSON.stringify(cowData);
  const data = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(dataString));

  const tx = await wallet.sendTransaction({
    to: await wallet.getAddress(),
    value: 0,
    data: data
  });

  await tx.wait();
  return tx.hash;
};

export const getRecentCowTransactions = async (address, limit = 10) => {
  const provider = getProvider();
  const latestBlock = await provider.getBlockNumber();
  const txs = [];

  for (let i = latestBlock; i >= latestBlock - 2000 && txs.length < limit; i--) {
    const block = await provider.getBlockWithTransactions(i);
    block.transactions.forEach((tx) => {
      if (tx.from.toLowerCase() === address.toLowerCase() && tx.data && tx.data !== "0x") {
        try {
          const json = JSON.parse(ethers.utils.toUtf8String(tx.data));
          txs.push({ ...json, hash: tx.hash, blockNumber: tx.blockNumber });
        } catch {
          console.error("Error parsing transaction data:", tx.data);
        }
      }
    });
  }
}
