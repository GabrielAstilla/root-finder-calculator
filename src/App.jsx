// App.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import Bisection from "./BisectionMethod";
import FalsePosition from "./FalsePosition";
import NewtonRaphson from "./NewtonRaphson";
import Secant from "./Secant";

function App() {
  const [method, setMethod] = useState("");
  const [roundOff, setRoundOff] = useState(4); // Default round off precision

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleRoundOffChange = (e) => {
    setRoundOff(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-emerald-500 py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex justify-center w-full">
            <span className="text-white text-3xl font-bold">Root Finder Calculator</span>
          </div>
        </div>
      </nav>

      {/* Title Bar */}
      <div className="bg-white shadow p-4 mb-4">
        {/* Method Selection */}
        <div className="mb-4 flex flex-col items-center">
          <label className="block mb-2 text-center">Select Method:</label>
          <select
            className="border border-gray-300 p-2 rounded-lg mb-2"
            value={method}
            onChange={handleMethodChange}
          >
            <option value="">Select Method</option>
            <option value="bisection">Bisection</option>
            <option value="false-position">False Position</option>
            <option value="newton-raphson">Newton-Raphson</option>
            <option value="secant">Secant</option>
          </select>
        </div>
        {/* Round Off Precision */}
        <div className="flex flex-col items-center">
          <label className="block mb-2 text-center">Round Off Precision:</label>
          <input
            type="number"
            min="1"
            value={roundOff}
            onChange={handleRoundOffChange}
            className="border border-gray-300 p-2 rounded-lg mb-4"
          />
        </div>
      </div>

      {/* Render selected method component */}
      {method === "bisection" && <Bisection roundOff={roundOff} />}
      {method === "false-position" && <FalsePosition roundOff={roundOff} />}
      {method === "newton-raphson" && <NewtonRaphson roundOff={roundOff} />}
      {method === "secant" && <Secant roundOff={roundOff} />}
    </div>
  );
}

export default App;
