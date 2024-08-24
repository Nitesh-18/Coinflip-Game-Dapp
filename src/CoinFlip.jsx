import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import { Contract, parseEther } from "ethers";

const CoinFlip = ({ userAccount }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("");
  const [result, setResult] = useState(null);
  const [contract, setContract] = useState(null);

  // Replace with your deployed contract address
  const contractAddress = "0x6b55EBf625eF05Aa7a3746b8C7E6c7AFf11d9aEA";
  const contractABI = [
    "function flip(bool _guess) public payable",
    "function withdraw() public",
  ];

  const initContract = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(contractInstance);
    } else {
      alert("Please install MetaMask!");
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
      const tx = await contract.flip(selectedSide === "heads", {
        value: parseEther(betAmount),
      });
      await tx.wait();
      // Update with real result if available from contract
      setResult("Coin flip successful"); // You may need to get the actual result from the contract
    } catch (error) {
      console.error("Error flipping the coin", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Coin Flip Game</h2>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
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
            selectedSide === "heads" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleSideChange("heads")}
        >
          Heads
        </button>
        <button
          className={`p-2 rounded ${
            selectedSide === "tails" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleSideChange("tails")}
        >
          Tails
        </button>
      </div>

      <button
        onClick={flipCoin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Flip Coin
      </button>

      {result && (
        <p className="mt-4 text-xl">
          Coin flip result: <span className="font-bold">{result}</span>!
        </p>
      )}
    </div>
  );
};

export default CoinFlip;
