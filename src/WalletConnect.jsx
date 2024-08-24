import React, { useState } from "react";

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
        <p className="text-green-500 bg-gray-800 p-2 rounded">
          Connected: {account.substring(0, 6)}...
          {account.substring(account.length - 4)}
        </p>
      ) : (
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
