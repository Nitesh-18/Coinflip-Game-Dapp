import React, { useState, useEffect } from "react";
import { parseEther } from "ethers";
import { BrowserProvider, Contract } from "ethers";

const CoinFlip = ({ userAccount }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("");
  const [result, setResult] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  // Replace with your deployed contract address
  const contractAddress = "0x6b55EBf625eF05Aa7a3746b8C7E6c7AFf11d9aEA";
  const contractABI = [
    "function flip(bool _guess) public payable",
    "function withdraw() public",
    "function getResult() public view returns (bool flipResult, bool userGuess)",
    "function getBalance() public view returns (uint256)",
  ];

  useEffect(() => {
    if (contract) {
      fetchContractBalance();
    }
  }, [contract]);

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

  const fetchContractBalance = async () => {
    try {
      const balance = await contract.getBalance();
      setContractBalance(parseFloat(balance) / 1e18); // Convert Wei to ETH
      setInsufficientFunds(false);
    } catch (error) {
      console.error("Error fetching contract balance", error);
    }
  };

  const handleBetAmountChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleSideChange = (side) => {
    setSelectedSide(side);
  };

  const estimateGas = async () => {
    try {
      const estimatedGas = await contract.estimateGas.flip(
        selectedSide === "heads",
        {
          value: parseEther(betAmount),
        }
      );
      console.log("Estimated Gas:", estimatedGas.toString());
      return estimatedGas;
    } catch (error) {
      console.error("Error estimating gas", error);
    }
  };

  const flipCoin = async () => {
    if (!contract) {
      alert("Contract not initialized!");
      return;
    }

    // Check if contract balance is sufficient
    if (contractBalance < parseFloat(betAmount)) {
      setInsufficientFunds(true);
      return;
    }

    try {
      const estimatedGas = await estimateGas();
      const tx = await contract.flip(selectedSide === "heads", {
        value: parseEther(betAmount),
        gasLimit: estimatedGas.toNumber(),
      });
      await tx.wait();

      // Retrieve the actual result from the contract
      const [flipResult, userGuess] = await contract.getResult();
      setResult(flipResult === userGuess ? "Heads" : "Tails");
    } catch (error) {
      console.error("Error flipping the coin", error);
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
      fetchContractBalance(); // Refresh contract balance after withdrawal
    } catch (error) {
      console.error("Error withdrawing earnings", error);
      alert("Withdrawal failed. Check the console for details.");
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

      {insufficientFunds && (
        <p className="mt-4 text-xl text-red-500">
          Insufficient funds in the contract. Please try again later.
        </p>
      )}

      {result && (
        <p className="mt-4 text-xl">
          Coin flip result: <span className="font-bold">{result}</span>!
        </p>
      )}

      <button
        onClick={withdrawEarnings}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Withdraw Earnings
      </button>
    </div>
  );
};

export default CoinFlip;
