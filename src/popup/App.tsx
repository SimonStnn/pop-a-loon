import React, { useState, useEffect } from "react";
import { storage } from "../utils";

const App: React.FC = () => {
  const [balloonCount, setBalloonCount] = useState(0);
  
  const fetchBalloonCount = async () => {
    const count = (await storage.get("balloonCount")).balloonCount;
    setBalloonCount(count || 0);
  };

  useEffect(() => {
    fetchBalloonCount();
  });

  return (
    <>
      <header>
        <h1>Pop-a-loon</h1>
      </header>
      <main>
        <p>Balloons Popped: {balloonCount}</p>
      </main>
    </>
  );
};

export default App;
