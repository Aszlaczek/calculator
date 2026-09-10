import React, { useState, useEffect, useRef } from "react";
import "./css/App.css";
import Buttons from "./components/Buttons";
import Visualizer, { VisualizerRef } from "./components/Visualizer";
import HistoryDrawer, { HistoryItem } from "./components/HistoryDrawer";
import { evaluate } from "./utils/mathParser";
import { audioSynth } from "./utils/audioSynth";

/**
 * Main application orchestrator for the Visualizer Calculator.
 * Manages calculations, variables, canvas triggers, themes, sound effects, and user history.
 */
const App: React.FC = () => {
  // Key lists for Standard and Scientific configurations
  const standardKeys = [
    "AC", "Delete", "%", "/",
    7, 8, 9, "*",
    4, 5, 6, "-",
    1, 2, 3, "+",
    0, ".", "="
  ];

  const scientificKeys = [
    "AC", "Delete", "(", ")", "/",
    "sin", "cos", "tan", "^", "*",
    "sqrt", "log", "ln", "abs", "-",
    7, 8, 9, "%", "+",
    4, 5, 6, "x", "=",
    1, 2, 3, 0, "."
  ];

  // Core Calculator States
  const [input, setInput] = useState<string>("0"); // Holds current working expression
  const [formula, setFormula] = useState<string>(""); // Holds top preview formula (e.g. "12 + 5 =")
  const [activeKey, setActiveKey] = useState<string | number | null>(null); // Visual feedback for keyboard presses
  
  // Customization & View States
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("calc-theme") || "cyberpunk");
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem("calc-muted") === "true");
  const [isScientific, setIsScientific] = useState<boolean>(() => localStorage.getItem("calc-scientific") === "true");
  const [isGraphMode, setIsGraphMode] = useState<boolean>(false); // When true, plots equations instead of particle waves
  
  // History Panel States
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // References
  const visualizerRef = useRef<VisualizerRef | null>(null);

  // Sync theme with body element CSS classes
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem("calc-theme", theme);
  }, [theme]);

  // Sync mute state with audio engine
  useEffect(() => {
    audioSynth.setMute(isMuted);
    localStorage.setItem("calc-muted", String(isMuted));
  }, [isMuted]);

  // Sync scientific layout preference
  useEffect(() => {
    localStorage.setItem("calc-scientific", String(isScientific));
    // If exiting scientific mode, turn off graphing mode
    if (!isScientific) {
      setIsGraphMode(false);
    }
  }, [isScientific]);

  /**
   * Evaluates the current input mathematical expression.
   */
  const handleEvaluate = () => {
    if (input.trim() === "" || input === "0") return;

    try {
      // Direct variable warning if graphing variable x is present in normal mode
      if (input.toLowerCase().includes("x") && !isGraphMode) {
        throw new Error("Switch to GRAPH mode to plot variables");
      }

      // Parse and evaluate using recursive-descent helper
      const computedResult = evaluate(input);
      
      // Formatting results nicely
      let formattedResult = Number.isInteger(computedResult)
        ? computedResult.toString()
        : parseFloat(computedResult.toFixed(8)).toString();

      // Record successfully evaluated items into calculations history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        equation: input,
        result: formattedResult,
        timestamp: new Date(),
      };
      
      setHistory((prev) => [newHistoryItem, ...prev]);
      setFormula(input + " =");
      setInput(formattedResult);
      
      // Synthesize arpeggiated success chords
      audioSynth.playSuccess();
    } catch (error: any) {
      // Display syntax errors temporarily
      setFormula("Error: " + (error.message || "Invalid syntax"));
      audioSynth.playDelete();
      
      // Clear error alert after 2 seconds
      setTimeout(() => {
        setFormula("");
      }, 2500);
    }
  };

  /**
   * Action handler for numeric, operator, action, and function button presses.
   */
  const handleAction = (val: string | number, clientX?: number, clientY?: number) => {
    const stringVal = val.toString();

    // Trigger canvas animation particles at the click event point
    visualizerRef.current?.triggerParticles(clientX, clientY);

    // Audio synthesizer pitch assignment
    if (["+", "-", "*", "/", "^", "%"].includes(stringVal)) {
      audioSynth.playOperator();
    } else if (["AC", "Delete"].includes(stringVal)) {
      audioSynth.playDelete();
    } else {
      audioSynth.playClick();
    }

    // Main Calculator Key Routing
    switch (stringVal) {
      case "AC":
        setInput("0");
        setFormula("");
        break;

      case "Delete":
        setInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
        break;

      case "=":
        handleEvaluate();
        break;

      // Handle brackets and functions neatly
      case "sin":
      case "cos":
      case "tan":
      case "sqrt":
      case "log":
      case "ln":
      case "abs":
        setInput((prev) => (prev === "0" ? `${stringVal}(` : prev + `${stringVal}(`));
        break;

      default:
        // Append input digits, operators, brackets, and variables
        setInput((prev) => {
          if (prev === "0" && !["+", "*", "/", "%", "^", ".", ")"].includes(stringVal)) {
            // Replace initial zero
            return stringVal;
          }
          return prev + stringVal;
        });
        break;
    }
  };

  /**
   * Capture keyboard inputs to make calculator responsive and tactile.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if the history side-drawer has focus or meta keys are pressed
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      let keyToTrigger: string | number | null = null;

      // Standard and Scientific keyboard character routing
      if (e.key >= "0" && e.key <= "9") {
        keyToTrigger = parseInt(e.key);
      } else {
        switch (e.key) {
          case "+":
          case "-":
          case "*":
          case "/":
          case "%":
          case "^":
          case ".":
          case "(":
          case ")":
            keyToTrigger = e.key;
            break;
          case "x":
          case "X":
            if (isScientific) keyToTrigger = "x";
            break;
          case "Enter":
          case "=":
            keyToTrigger = "=";
            break;
          case "Backspace":
            keyToTrigger = "Delete";
            break;
          case "Escape":
            keyToTrigger = "AC";
            break;
          default:
            break;
        }
      }

      if (keyToTrigger !== null) {
        e.preventDefault();
        setActiveKey(keyToTrigger);
        
        // Emulate layout click coordinates from the visualizer center
        handleAction(keyToTrigger);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isScientific, input, isGraphMode]);

  return (
    <>
      {/* Moving decorative background blobs for modern visual design */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Grid Scanline filters for terminal CRT emulation */}
      <div className="terminal-scanlines"></div>

      <div className="calc-container">
        {/* Slide-out history tape side-drawer */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectEquation={(eq) => {
            setInput(eq);
            setIsHistoryOpen(false);
            audioSynth.playClick();
          }}
          onSelectResult={(res) => {
            setInput((prev) => (prev === "0" ? res : prev + res));
            setIsHistoryOpen(false);
            audioSynth.playClick();
          }}
          onClearHistory={() => {
            setHistory([]);
            audioSynth.playDelete();
          }}
          theme={theme}
        />

        {/* Toolbar Header section */}
        <div className="calc-toolbar">
          <div className="toolbar-left">
            <button
              className="toolbar-btn"
              onClick={() => setIsHistoryOpen(true)}
              title="View History Tape"
              aria-label="View calculation history"
            >
              📜 History
            </button>
            <select
              className="theme-selector"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              title="Switch Visual Theme"
              aria-label="Select visual theme"
            >
              <option value="cyberpunk">Cyberpunk Neon</option>
              <option value="glass">Glass Dream</option>
              <option value="terminal">Retro CRT</option>
              <option value="aurora">Aurora Light</option>
            </select>
          </div>

          <div className="toolbar-right">
            {isScientific && (
              <button
                className={`toolbar-btn ${isGraphMode ? "active" : ""}`}
                onClick={() => {
                  setIsGraphMode(!isGraphMode);
                  audioSynth.playClick();
                }}
                title="Toggle Graphing Plotter mode"
                aria-label="Toggle graphing mode"
                aria-pressed={isGraphMode}
              >
                📈 Graph
              </button>
            )}
            <button
              className={`toolbar-btn ${isScientific ? "active" : ""}`}
              onClick={() => {
                setIsScientific(!isScientific);
                audioSynth.playClick();
              }}
              title="Toggle Scientific Layout"
              aria-label="Toggle scientific calculator layout"
              aria-pressed={isScientific}
            >
              🔬 Scientific
            </button>
            <button
              className="toolbar-btn"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
              aria-label={isMuted ? "Unmute calculator sounds" : "Mute calculator sounds"}
              aria-pressed={isMuted}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        {/* High DPI interactive visualizer panel */}
        <div className="visualizer-wrapper">
          <Visualizer
            ref={visualizerRef}
            graphExpression={isGraphMode ? input : null}
            theme={theme}
          />
        </div>

        {/* Output Screen display */}
        <div className="calc-screen">
          <div className="screen-formula">{formula}</div>
          <div className="screen-input">{input}</div>
        </div>

        {/* Dynamic button keypad grid */}
        <div className={`calc-keypad ${isScientific ? "scientific" : ""}`}>
          <Buttons
            list={isScientific ? scientificKeys : standardKeys}
            onClick={(val, e) => handleAction(val, e.clientX, e.clientY)}
            activeKey={activeKey}
          />
        </div>
      </div>
    </>
  );
};

export default App;
