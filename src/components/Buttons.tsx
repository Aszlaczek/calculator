import { useState } from "react";



const Buttons = (props: {
  list: (string | number)[];
  number: string;
  setNumber: Function;
  res: Function;
}) => {
  const [operation, setOperation] = useState("");

  const operations: Operation ={
    '+': (n1,n2) => n1+n2,
  }
  
  const pushNumber = (e: number) => {
    let res = props.number;
    res === "0" ? (res = e.toString()) : (res += e);
    props.setNumber(res);
  };

  const calculate = (e: string) => {
    let res = props.number;
    let res2 = props.number;
    console.log(res);
    switch (e) {
      case "Delete":
        res.length === 1 ? (res = "0") : (res = res.slice(0, -1));
        // res = res.slice(0, -1);
        break;
      case "AC":
        res = "0";
        break;
      case "X":
        props.res(res2 + "x");
        setOperation("*");
        res = "0";
        break;
      case "=":
        res = (Number(res) {operation}  Number(props.res)).toString();
        break;
    }
    props.setNumber(res);
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
