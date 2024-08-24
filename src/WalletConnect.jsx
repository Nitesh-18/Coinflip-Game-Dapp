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
    <div className="flex flex-col justify-center items-center h-screen text-white">
      <h2 className="text-4xl font-extrabold mb-4 animate-bounce">
        Connect Your Wallet
      </h2>
      <div className="w-16 h-16 mb-4">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-full"
        >
          <source src="/Coin.mp4" type="video/mp4" />
        </video>
      </div>

      {account ? (
        <p className="text-green-500 text-2xl">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition transform hover:scale-105"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
