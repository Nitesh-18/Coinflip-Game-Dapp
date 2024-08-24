import React, { useState } from "react";
// import { ethers } from "ethers";

const WalletConnect = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        onConnect(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {account ? (
        <p className="text-green-500">Connected: {account}</p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
