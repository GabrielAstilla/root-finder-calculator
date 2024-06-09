import React, { useState } from "react";
import * as math from 'mathjs';

function Secant({ roundOff }) {
  const [equation, setEquation] = useState("");
  const [xa, setXa] = useState("");
  const [xb, setXb] = useState("");
  const [result, setResult] = useState(null);
  const [iterationTable, setIterationTable] = useState([]);

  const evaluateEquation = (x, equationString) => {
    try {
      const scope = { x };
      const result = math.evaluate(equationString, scope);
      if (isNaN(result)) {
        console.error("Evaluation result is NaN:", result);
        return null;
      }
      return result;
    } catch (error) {
      console.error("Error evaluating equation:", error);
      return null;
    }
  };

  const secantMethod = () => {
    let iter = 1;
    let x0 = parseFloat(xa);
    let x1 = parseFloat(xb);
    let x2;
    let relativeError = 0;

    const table = [];

    do {
      const fxA = evaluateEquation(x0, equation);
      const fxB = evaluateEquation(x1, equation);
      if (iter > 1) {
        relativeError = Math.abs((x1 - x0) / x1) * 100; // Calculate relative error in percentage
      }

      x2 = x1 - (fxB * (x1 - x0)) / (fxB - fxA);

      table.push({
        iteration: iter,
        x0: x0.toFixed(roundOff),
        x1: x1.toFixed(roundOff),
        x2: x2.toFixed(roundOff),
        fxA: fxA.toFixed(roundOff),
        fxB: fxB.toFixed(roundOff),
        relativeError: iter > 1 ? relativeError.toFixed(4) + "%" : "" // Format relative error with 4 decimal places
      });

      if (iter > 1 && relativeError <= 0.0000) {
        setResult(x2.toFixed(roundOff));
        setIterationTable(table);
        return;
      }

      x0 = x1;
      x1 = x2;
      iter++;
    } while (iter < 1000); // Maximum iterations to prevent infinite loop

    setResult(x2.toFixed(roundOff));
    setIterationTable(table);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!equation || !xa || !xb) {
      alert("Please fill in all fields.");
      return;
    }

    // Call the Secant method function
    secantMethod();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Secant Method</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="equation" className="block mb-1">
              Equation:
            </label>
            <input
              type="text"
              id="equation"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              placeholder="e.g., x^2 - 4"
              required
            />
          </div>
          <div>
            <label htmlFor="xa" className="block mb-1">
              Initial value for XA:
            </label>
            <input
              type="text"
              id="xa"
              value={xa}
              onChange={(e) => setXa(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              placeholder="e.g., 0"
              required
            />
          </div>
          <div>
            <label htmlFor="xb" className="block mb-1">
              Initial value for XB:
            </label>
            <input
              type="text"
              id="xb"
              value={xb}
              onChange={(e) => setXb(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              placeholder="e.g., 2"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Solve
        </button>
      </form>
      {result !== null && (
        <div>
          <h3 className="font-bold text-lg">Result: {result}</h3>
          <div className="overflow-x-auto">
            <table className="mt-4 w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Iterations</th>
                  <th className="px-4 py-2">XA</th>
                  <th className="px-4 py-2">XB</th>
                  <th className="px-4 py-2">f(XA)</th>
                  <th className="px-4 py-2">f(XB)</th>
                  <th className="px-4 py-2">Relative Error</th>
                </tr>
              </thead>
              <tbody>
                {iterationTable.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{row.iteration}</td>
                    <td className="border px-4 py-2">{row.x0}</td>
                    <td className="border px-4 py-2">{row.x1}</td>
                    <td className="border px-4 py-2">{row.fxA}</td>
                    <td className="border px-4 py-2">{row.fxB}</td>
                    <td className="border px-4 py-2">{row.relativeError}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Secant;
