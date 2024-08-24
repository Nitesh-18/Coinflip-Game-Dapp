import React, { useState } from "react";
import coinFlipVideo from "./assets/coin-flip.mp4"; // Ensure the path is correct

const WalletConnect = ({ onConnect, onWalletConnected }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        onConnect(accounts[0]);
        onWalletConnected(accounts[0]); // Trigger toast in CoinFlip
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        {account ? (
          <p className="text-green-500 text-2xl bg-slate-500">Connected: {account}</p>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
        <div className="mt-6">
          <video
            src={coinFlipVideo}
            autoPlay
            loop
            muted
            className="w-48 h-48 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
