import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const paragraph =
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet and is commonly used to test typing speed and keyboard layouts.";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

function TypingTest() {
  const [input, setInput] = useState("");
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (running && time > 0) {
      timer = setTimeout(() => setTime(time - 1), 1000);
    }
    if (time === 0 && running) {
      setRunning(false);
      setFinished(true);
    }
    return () => clearTimeout(timer);
  }, [time, running]);

  const startTest = () => {
    setRunning(true);
    setFinished(false);
    setTime(30);
    setInput("");
  };

  const restartTest = () => {
    setRunning(false);
    setFinished(false);
    setTime(30);
    setInput("");
  };

  const handleChange = (e) => {
    if (!running) return;
    setInput(e.target.value);
  };

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const wpm = Math.round(wordCount * (60 / 30));

  const chartData = [
    { name: "WPM", value: Math.min(wpm, 120) },
    { name: "Remaining", value: 120 - Math.min(wpm, 120) },
  ];

  return (
    <div className="card">
      <p className="paragraph">{paragraph}</p>

      <textarea
        className="typing-box"
        placeholder="Start typing here..."
        value={input}
        onChange={handleChange}
        disabled={!running}
      />

      <div className="info">
        <div className="time">
          Time Left: <span>{time}s</span>
        </div>
      </div>

      {!running && !finished && (
        <button className="start-btn" onClick={startTest}>
          Start Test
        </button>
      )}

      {finished && (
        <div className="result">
          <h2>Your Typing Speed</h2>

          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <h3>{wpm} WPM</h3>

          <button className="restart-btn" onClick={restartTest}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default TypingTest;