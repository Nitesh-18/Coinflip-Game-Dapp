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

      console.log("Contract balance in ETH:", formatEther(balance));
      console.log("Bet amount in Wei:", betAmountInWei.toString());

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
    <div className="flex flex-col items-center mt-8 bg-gray-900 text-white min-h-screen transition-all">
      <h2 className="text-3xl font-bold mb-6 animate-pulse">Coin Flip Game</h2>

      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out mb-6"
        onClick={initContract}
      >
        Initialize Contract
      </button>

      <input
        type="number"
        placeholder="Enter bet amount (ETH)"
        value={betAmount}
        onChange={handleBetAmountChange}
        className="border p-3 rounded-lg mb-6 bg-gray-800 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <div className="flex justify-center mb-6">
        <button
          className={`mr-4 p-3 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out ${
            selectedSide === "heads"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-800"
          }`}
          onClick={() => handleSideChange("heads")}
        >
          Heads
        </button>
        <button
          className={`p-3 rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out ${
            selectedSide === "tails"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-800"
          }`}
          onClick={() => handleSideChange("tails")}
        >
          Tails
        </button>
      </div>

      <button
        onClick={flipCoin}
        className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        Flip Coin
      </button>

      {result && (
        <p className="mt-6 text-2xl font-bold animate-bounce">
          Coin flip result: <span>{result}</span>!
        </p>
      )}

      {error && (
        <p className="mt-6 text-xl text-red-500 animate-pulse">{error}</p>
      )}

      <button
        onClick={withdrawEarnings}
        className="bg-yellow-600 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out mt-8"
      >
        Withdraw Earnings
      </button>

      {contractBalance !== null && (
        <p className="mt-6 text-xl font-semibold">
          Contract balance:{" "}
          <span className="text-yellow-400">{contractBalance} ETH</span>
        </p>
      )}
    </div>
  );
};

export default CoinFlip;
