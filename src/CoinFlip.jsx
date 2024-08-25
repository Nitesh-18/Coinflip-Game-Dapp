import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import coinFlipVideo from "./assets/coin-flip.mp4"; // Ensure the path is correct

const CoinFlip = ({ userAccount }) => {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("");
  const [result, setResult] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [error, setError] = useState("");
  const [connectedAccount, setConnectedAccount] = useState(userAccount);

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

  // Function to show toast notification
  const notify = (account) => {
    toast.success(`Wallet Connected`, {
      position: "top-right",
      autoClose: 3000, // 3 seconds
    });
  };

  // Trigger toast when wallet is connected
  useEffect(() => {
    if (connectedAccount) {
      notify(connectedAccount);
    }
  }, [connectedAccount]);

  // Handle the wallet connection from WalletConnect component
  const handleWalletConnected = (account) => {
    setConnectedAccount(account);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-900">
      <h2 className="text-4xl font-bold mb-4 flex items-center">
        <span className="mr-4">Coin Flip Game</span>
        <div className="w-32 h-32 rounded-full overflow-hidden flex justify-center items-center border-4 border-white shadow-lg transform hover:scale-110 transition-transform duration-500">
          <video
            src={coinFlipVideo}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          ></video>
        </div>
      </h2>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded mb-4 transition-colors duration-300 transform hover:scale-105"
        onClick={initContract}
      >
        Initialize Contract
      </button>

      <input
        type="number"
        placeholder="Enter bet amount (ETH)"
        value={betAmount}
        onChange={handleBetAmountChange}
        className="border p-2 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      />

      <div className="flex justify-center mb-4">
        <button
          className={`mr-4 p-2 rounded transition-all duration-300 transform hover:scale-105 ${
            selectedSide === "heads"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleSideChange("heads")}
        >
          Heads
        </button>
        <button
          className={`p-2 rounded transition-all duration-300 transform hover:scale-105 ${
            selectedSide === "tails"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleSideChange("tails")}
        >
          Tails
        </button>
      </div>

      <button
        onClick={flipCoin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-8 rounded transition-colors duration-300 transform hover:scale-105"
      >
        Flip Coin
      </button>

      {result && (
        <p className="mt-4 text-xl transform transition-opacity duration-500 ease-in-out">
          Coin flip result: <span className="font-bold">{result}</span>!
        </p>
      )}

      {error && (
        <p className="mt-4 text-xl text-red-500 transform transition-opacity duration-500 ease-in-out">
          <span className="font-bold">{error}</span>
        </p>
      )}

      <button
        onClick={withdrawEarnings}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-8 rounded mt-4 transition-colors duration-300 transform hover:scale-105"
      >
        Withdraw Earnings
      </button>

      {contractBalance !== null && (
        <p className="mt-4 text-xl">
          Contract balance:{" "}
          <span className="font-bold">{contractBalance} ETH</span>
        </p>
      )}

      {connectedAccount && (
        <p className="mt-4 text-lg bg-gray-800 text-white p-2 rounded transition-transform duration-300 transform hover:scale-105">
          Connected: <span className="font-bold">{connectedAccount}</span>
        </p>
      )}

      <ToastContainer />
    </div>
  );
};

export default CoinFlip;
