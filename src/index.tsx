import React from "react";
import ReactDom from "react-dom";

const main = () => {
  const app = document.querySelector("#app");
  if (!app) {
    return;
  }

  ReactDom.render(<div>Ohayo Nippon</div>, app);
};

main();
