import { ethers } from "ethers";
import { useEffect, useState } from "react";

const providerUrl =
  "https://json-rpc.dyhbelsmtc7ro3o07nsxb51lm.blockchainnodeengine.com?key=AIzaSyBK4kHy9qhxgVYCHqhgH94b8rNxXZ5IVH4";
const provider = new ethers.JsonRpcProvider(providerUrl);

function CowList() {
  const [cows, setCows] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const walletAddress = "0x1Bf3D16075d19A9908C24724cAFCD6E843285335"; // ⚠️ cambia esto

      const latestBlock = await provider.getBlockNumber();
      const foundCows = [];

      for (let i = latestBlock; i >= latestBlock - 2000; i--) {
        const block = await provider.getBlock(i, true); // ✅ Esto sí funciona en ethers v6
        for (const tx of block.transactions) {
          if (
            tx.from.toLowerCase() === walletAddress.toLowerCase() &&
            tx.data &&
            tx.data !== "0x"
          ) {
            try {
              const cow = JSON.parse(ethers.toUtf8String(tx.data));
              foundCows.push({ ...cow, hash: tx.hash });
            } catch (err) {
              console.error("Error al parsear JSON:", err);
              // no JSON, skip
            }
          }
        }
        if (foundCows.length >= 10) break;
      }

      setCows(foundCows);
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>📋 Vacas Registradas</h2>
      {cows.length === 0 ? (
        <p>No se encontraron registros recientes</p>
      ) : (
        <ul>
          {cows.map((cow, idx) => (
            <li key={idx}>
              <strong>{cow.name}</strong> ({cow.breed}) - {cow.birthDate}
              <br />
              Tx:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${cow.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {cow.hash.slice(0, 20)}...
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CowList;
