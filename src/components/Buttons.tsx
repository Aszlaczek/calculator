import React from "react";

interface ButtonsProps {
  list: (string | number)[];
  onClick: (value: string | number, e: React.MouseEvent<HTMLButtonElement>) => void;
  activeKey: string | number | null; // Currently simulated pressed key from keyboard
}

const Buttons: React.FC<ButtonsProps> = ({ list, onClick, activeKey }) => {
  // Categorize keys for distinct theme styling
  const getButtonClass = (val: string | number): string => {
    const sVal = val.toString();
    
    // Check if active (keyboard simulation)
    const isActive = activeKey !== null && activeKey.toString().toLowerCase() === sVal.toLowerCase();
    const activeClass = isActive ? "pressed" : "";

    // Operator keys
    if (["+", "-", "*", "/", "^", "%", "="].includes(sVal)) {
      return `item operator-btn ${activeClass}`;
    }
    
    // Clear/Action keys
    if (["AC", "Delete", "C", "History", "Graph", "Standard", "🔊", "🔇"].includes(sVal)) {
      return `item action-btn ${activeClass}`;
    }
    
    // Scientific function keys
    if (["sin", "cos", "tan", "sqrt", "log", "ln", "abs", "(", ")", "x"].includes(sVal)) {
      return `item function-btn ${activeClass}`;
    }
    
    // Default numbers and decimals
    return `item number-btn ${activeClass}`;
  };

  // Convert display names for operators to look nicer
  const formatLabel = (val: string | number): React.ReactNode => {
    const sVal = val.toString();
    switch (sVal) {
      case "*":
        return "×";
      case "/":
        return "÷";
      case "Delete":
        return "⌫";
      case "sqrt":
        return "√";
      default:
        return sVal;
    }
  };

  return (
    <>
      {list.map((e, id) => {
        // Special layout class for elements
        let layoutClass = "";
        
        // Double-width button adjustments (e.g. for "0" in standard layout)
        if (e === 0 || e === "0") {
          layoutClass = "double-width-zero";
        }

        return (
          <button
            key={id}
            onClick={(evt) => onClick(e, evt)}
            className={`${getButtonClass(e)} ${layoutClass}`}
            type="button"
            data-key={e}
          >
            {formatLabel(e)}
          </button>
        );
      })}
    </>
  );
};

export default Buttons;
