import React, { useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

const CoinFlip = ({ userAccount }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("");
  const [result, setResult] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [error, setError] = useState("");

  const contractAddress = "0xe18BD0fEBf0341ee94fccD8d5E90286074370502";
  const contractABI = [
    "function flip(bool _guess) public payable",
    "function withdraw() public",
    "function getResult() public view returns (bool flipResult, bool userGuess)",
    "function getBalance() public view returns (uint256)",
  ];

  const initContract = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
        fetchContractBalance(contractInstance);
      } catch (err) {
        console.error("Error initializing contract", err);
        setError(
          "Failed to initialize contract. Check the console for details."
        );
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchContractBalance = async (contractInstance) => {
    try {
      const balance = await contractInstance.getBalance();
      setContractBalance(formatEther(balance));
      setError("");
    } catch (err) {
      console.error("Error fetching contract balance", err);
      setError(
        "Failed to fetch contract balance. Check the console for details."
      );
    }
  };

  const handleBetAmountChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleSideChange = (side) => {
    setSelectedSide(side);
  };

  const flipCoin = async () => {
    if (!contract) {
      alert("Contract not initialized!");
      return;
    }

    try {
      const balance = await contract.getBalance(); // Balance is in Wei
      const betAmountInWei = parseEther(betAmount);

      if (betAmountInWei > balance) {
        setError("Insufficient funds in the contract.");
        return;
      }

      const tx = await contract.flip(selectedSide === "heads", {
        value: betAmountInWei,
      });
      await tx.wait();

      const [flipResult] = await contract.getResult();
      setResult(flipResult ? "Heads" : "Tails");
      setError("");
    } catch (err) {
      console.error("Error flipping the coin", err);
      setError("Failed to flip the coin. Check the console for details.");
    }
  };

  const withdrawEarnings = async () => {
    if (!contract) {
      alert("Contract not initialized!");
      return;
    }

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Withdrawal successful!");
    } catch (err) {
      console.error("Error withdrawing earnings", err);
      alert("Withdrawal failed. Check the console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-3xl font-extrabold mb-4 text-gradient bg-gradient-to-r from-green-400 to-blue-500">
        Coin Flip Game
      </h2>

      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4 transition-all duration-300 transform hover:scale-105"
        onClick={initContract}
      >
        Initialize Contract
      </button>

      <input
        type="number"
        placeholder="Enter bet amount (ETH)"
        value={betAmount}
        onChange={handleBetAmountChange}
        className="border p-2 rounded mb-4"
      />

      <div className="flex justify-center mb-4">
        <button
          className={`mr-4 p-2 rounded ${
            selectedSide === "heads"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          } transition-all duration-300 transform hover:scale-105`}
          onClick={() => handleSideChange("heads")}
        >
          Heads
        </button>
        <button
          className={`p-2 rounded ${
            selectedSide === "tails"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-blue-100"
          } transition-all duration-300 transform hover:scale-105`}
          onClick={() => handleSideChange("tails")}
        >
          Tails
        </button>
      </div>

      <button
        onClick={flipCoin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
      >
        Flip Coin
      </button>

      {result && (
        <p className="mt-4 text-2xl font-semibold text-gray-700 transition-all duration-500">
          Coin flip result:{" "}
          <span className="font-bold text-gradient bg-gradient-to-r from-pink-500 to-yellow-500">
            {result}
          </span>
          !
        </p>
      )}

      {error && (
        <p className="mt-4 text-xl text-red-500">
          <span className="font-bold">{error}</span>
        </p>
      )}

      <button
        onClick={withdrawEarnings}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4 transition-all duration-300 transform hover:scale-105"
      >
        Withdraw Earnings
      </button>

      {contractBalance !== null && (
        <p className="mt-4 text-xl text-gradient bg-gradient-to-r from-red-500 to-purple-500">
          Contract balance:{" "}
          <span className="font-bold">{contractBalance} ETH</span>
        </p>
      )}
    </div>
  );
};

export default CoinFlip;
