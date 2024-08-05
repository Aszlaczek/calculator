import { useState } from "react";

const calc: { [key: string]: Function } = {
  "+": (n1: string, n2: string) => (Number(n1) + Number(n2)).toString(),
  "-": (n1: string, n2: string) => (Number(n1) - Number(n2)).toString(),
  "*": (n1: string, n2: string) => (Number(n1) * Number(n2)).toString(),
  "/": (n1: string, n2: string) => (Number(n1) / Number(n2)).toString(),
  "^": (n1: string, n2: string) => Math.pow(Number(n1), Number(n2)).toString(),
  ".": (n1: string) => (Number(n1) * -1).toString(),
};
const Buttons = (props: {
  list: (string | number)[];
  number: string;
  setNumber: Function;
  res: Function;
}) => {
  const pushNumber = (e: number) => {
    let res = props.number;
    res === "0" ? (res = e.toString()) : (res += e);
    props.setNumber(res);
  };

  const operation = {
    add: "+",
    sub: "-",
    mul: "*",
    div: "/",
    pow: "^",
    dot: ".",
  };
  const [op, setOp] = useState("");
  const [val, setVal] = useState("");
  const calculate = (e: string) => {
    let res = props.number;
    console.log(res);
    let val = res;
    switch (e) {
      case "Delete":
        res.length === 1 ? (res = "0") : (res = res.slice(0, -1));
        break;
      case "AC":
        res = "0";
        props.res("0");
        break;
      case "X":
        props.res(res + "x");
        setVal(res);
        // res = calc[operation.mul](val, res);
        setOp(operation.mul);
        res = "0";
        break;
      case "=":
        props.res("0");
        val = "";
        break;
    }
    res = calc[op](res, val);
    props.setNumber(res);
    setOp("");
  };

  const action = (e: string | number) => {
    typeof e !== "string" ? pushNumber(e) : calculate(e);
  };
  return (
    <>
      {props.list.map((e, id) => {
        return (
          <button key={id} onClick={() => action(e)} className="item">
            {e}
          </button>
        );
      })}
    </>
  );
};

export default Buttons;
