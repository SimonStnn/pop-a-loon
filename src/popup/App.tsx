import React, { useState, useEffect } from "react";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { storage } from "../utils";
import { Message } from "../const";
import NavigationIcon from "../components/NavigationIcon";

const App: React.FC = () => {
  const [balloonCount, setBalloonCount] = useState(0);

  const fetchBalloonCount = async () => {
    const count = (await storage.get("balloonCount")).balloonCount;
    setBalloonCount(count || 0);
  };

  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      if (message.action === "updateCounter") {
        setBalloonCount(message.balloonCount);
      }
    },
  );

  useEffect(() => {
    fetchBalloonCount();
  });

  return (
    <>
      <header className="flex items-center justify-center bg-primary px-2 py-4 text-primary-foreground">
        <NavigationIcon to={"/settings"} icon={faGear} side={"right"} />
        <h1 className="text-xl font-bold">Pop-a-loon</h1>
      </header>
      <main>
        <p>Balloons Popped: {balloonCount}</p>
      </main>
    </>
  );
};

export default App;
