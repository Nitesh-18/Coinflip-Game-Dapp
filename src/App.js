import React, { useState } from "react";
import WalletConnect from "./WalletConnect";
import CoinFlip from "./CoinFlip";
import "./App.css";

function App() {
  const [userAccount, setUserAccount] = useState(null);

  const handleConnect = (account) => {
    setUserAccount(account);
  };

  return (
    <div className="App">
      {!userAccount ? (
        <WalletConnect onConnect={handleConnect} />
      ) : (
        <div>
          <CoinFlip userAccount={userAccount} />
        </div>
      )}
    </div>
  );
}

export default App;
