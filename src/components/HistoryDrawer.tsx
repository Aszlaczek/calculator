import React from "react";

export interface HistoryItem {
  id: string;
  equation: string;
  result: string;
  timestamp: Date;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectEquation: (eq: string) => void;
  onSelectResult: (res: string) => void;
  onClearHistory: () => void;
  theme: string;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectEquation,
  onSelectResult,
  onClearHistory,
  theme,
}) => {
  return (
    <div className={`history-drawer ${isOpen ? "open" : ""} theme-${theme}`}>
      {/* Header section with closing action */}
      <div className="drawer-header">
        <h3>Calculation History</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close history drawer">
          &times;
        </button>
      </div>

      {/* List content of past equations */}
      <div className="drawer-content">
        {history.length === 0 ? (
          <div className="empty-state">
            <p>No history yet.</p>
            <span>Your calculated expressions will be recorded here.</span>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-meta">
                  <span className="history-time">
                    {item.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  className="history-equation"
                  onClick={() => onSelectEquation(item.equation)}
                  title="Click to copy equation to input"
                >
                  {item.equation}
                </div>
                <div
                  className="history-result"
                  onClick={() => onSelectResult(item.result)}
                  title="Click to copy result to input"
                >
                  = {item.result}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer controls */}
      {history.length > 0 && (
        <div className="drawer-footer">
          <button className="clear-btn" onClick={onClearHistory} aria-label="Clear calculation history">
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryDrawer;
