import { useRef, useState } from "react";
import "./css/App.css";
import Buttons from "./components/Buttons";

const App = () => {
  const listAll = [
    "*",
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

  const calc: { [key: string]: Function } = {
    "+": (n1: number, n2: number) => n1 + n2,
    "-": (n1: number, n2: number) => n1 - n2,
    "*": (n1: number, n2: number) => n1 * n2,
    "/": (n1: number, n2: number) => n1 / n2,
    "^": (n1: number, n2: number) => Math.pow(n1, n2),
    ".": (n1: number) => (n1.toString().includes(".") ? "" : n1 / 10),
  };

  const [input, setInput] = useState<string>("0");
  const [operation, setOperation] = useState<string | null>(null);
  const prevValue = useRef<string | null>(null);
  const [result, setResult] = useState<string>("");

  const handleButtonClick = (e: string | number) => {
    if (typeof e === "number" || e === ".") {
      handleNumberInput(e.toString());
    } else {
      handleOperationInput(e as string);
    }
  };

  const handleNumberInput = (num: string) => {
    if (num === ".") {
      if (input.includes(".")) return;
    }
    setInput(input === "0" && num !== "." ? num : input + num);
  };

  const handleOperationInput = (op: string) => {
    if (input === "0" && result === "") return;
    switch (op) {
      case "AC":
        resetCalculator();
        break;
      case "Delete":
        handleDelete();
        break;
      case "=":
        if (operation && prevValue !== null) {
          const newResult = calc[operation](
            parseFloat(prevValue.current!),
            parseFloat(input)
          );
          setResult("");
          setInput(newResult.toString());
          prevValue.current = "0";
          setOperation(null);
        }
        break;
      case ".":
        handleNumberInput(op);
        break;
      default:
        setOperation(op);
        prevValue.current = input;
        setInput("0");
        setResult((prevValue.current += op));
        break;
    }
  };

  const handleDelete = () => {
    setInput(input.length > 1 ? input.slice(0, -1) : "0");
  };

  const resetCalculator = () => {
    setInput("0");
    setOperation(null);
    prevValue.current = null;
    setResult("");
  };

  return (
    <>
      <div id="title">
        <span className="res1">{result}</span>
        <span className="res2">{input}</span>
      </div>
      <div className="buttons">
        <Buttons list={listAll} onClick={handleButtonClick} />
      </div>
    </>
  );
};

export default App;
