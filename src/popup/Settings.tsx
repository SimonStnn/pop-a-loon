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
        sttings!$
      </main>
    </>
  );
};
