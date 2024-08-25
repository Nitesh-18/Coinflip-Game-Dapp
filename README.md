
# Coin Flip Game DApp

This is a decentralized application (DApp) built on the Ethereum blockchain. The Coin Flip Game allows users to place bets on the outcome of a coin flip using cryptocurrency. The game is connected to a smart contract deployed on the Sepolia testnet, and users can interact with it using MetaMask. The application provides a sleek and intuitive UI for betting, viewing results, and withdrawing earnings.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Setup](#project-setup)
- [Smart Contract](#smart-contract)
- [Usage](#usage)
- [License](#license)

## Features

- **Betting System**: Users can place bets on either heads or tails using ETH.
- **Real-Time Interaction**: The application interacts with a smart contract in real-time to determine and display the outcome of each coin flip.
- **Withdrawal Mechanism**: Users can withdraw their earnings from the smart contract.
- **Visual Effects**: The UI includes animations and a video that enhances the user experience.

## Technologies Used

### Frontend

- **React**: JavaScript library for building the user interface.
- **Ethers.js**: A library for interacting with the Ethereum blockchain.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **React Toastify**: For displaying notifications.
- **Video Integration**: The app includes a video asset to enhance the visual appeal.

### Backend

- **Smart Contract**: Written in Solidity and deployed on the Sepolia testnet. The contract handles the core logic for the coin flip game.

## Project Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.
- **MetaMask**: Install the MetaMask extension in your browser and connect it to the Sepolia testnet.

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/coin-flip-game.git
   cd coin-flip-game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Build for Production

To build the project for production, run:

```bash
npm run build
```

## Smart Contract

The smart contract for this project is written in Solidity and deployed on the Sepolia testnet. The contract includes the following key functions:

- **flip(bool \_guess)**: Allows users to bet on the outcome of a coin flip.
- **withdraw()**: Enables users to withdraw their earnings.
- **getResult()**: Retrieves the result of the last coin flip.
- **getBalance()**: Returns the current balance of the contract in Wei.

### Contract Details

- **Address**: `0xe18BD0fEBf0341ee94fccD8d5E90286074370502`
- **ABI**: The ABI is defined in the React app's code for interaction.

## Usage

1. **Initialize the Contract**: Connect your MetaMask wallet and initialize the contract by clicking the "Initialize Contract" button.
2. **Place a Bet**: Enter the amount of ETH you want to bet, choose either "Heads" or "Tails," and click "Flip Coin."
3. **View Result**: The result of the coin flip will be displayed on the screen.
4. **Withdraw Earnings**: If you've won, you can withdraw your earnings by clicking "Withdraw Earnings."



