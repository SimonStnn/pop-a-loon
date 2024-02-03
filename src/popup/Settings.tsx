import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NavigationIcon from "../components/NavigationIcon";

export default () => {
  return (
    <>
      <header>
        <h1>Settings</h1>
        <NavigationIcon to={"/"} icon={faArrowLeft} side={"left"} />
      </header>
      <main>
        <div className="settings-container">
          <label>Reset Balloons Popped</label>
          <button
            className="button danger"
            onClick={() => {
              chrome.runtime.sendMessage({ action: "resetCounter" });
            }}
          >
            Reset
          </button>
        </div>
      </main>
    </>
  );
};
