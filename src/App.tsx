import { useState } from "react";
import "./css/App.css";
import Buttons from "./components/Buttons";

const App = () => {
  const listAll = [
    "X",
    "/",
    "AC",
    "Delete",
    7,
    8,
    9,
    "^",
    4,
    5,
    6,
    "-",
    1,
    2,
    3,
    "+",
    0,
    ".",
    "=",
  ];

  const [number, setNumber] = useState("0");
  const [res, setRes] = useState("0");

  return (
    <main>
      <div id="title">
        <span className="res1">{res}</span>
        <span className="res2">{number}</span>
      </div>
      <div className="buttons">
        <Buttons
          list={listAll}
          number={number}
          setNumber={setNumber}
          res={setRes}
        />
      </div>
    </main>
  );
};

export default App;
