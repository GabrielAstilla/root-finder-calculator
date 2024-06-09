import React, { useState } from "react";
import { evaluate, derivative } from "mathjs";

function NewtonRaphson({ roundOff }) {
  const [equation, setEquation] = useState("");
  const [xo, setXo] = useState("");
  const [iterationData, setIterationData] = useState([]);
  const [root, setRoot] = useState(null);
  const [equationDerivative, setEquationDerivative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!equation || !xo) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const xoNum = parseFloat(xo);
      const derivativeExpr = calculateDerivative(equation);
      setEquationDerivative(derivativeExpr.toString());
      const iterations = performNewtonRaphson(equation, xoNum, derivativeExpr);
      setIterationData(iterations);
      setRoot(iterations[iterations.length - 1].x);
    } catch (error) {
      alert("An error occurred. Please check your inputs and try again.");
      console.error("Error performing Newton-Raphson method:", error);
    }
  };

  const calculateDerivative = (equation) => {
    try {
      const expr = derivative(equation, "x");
      return expr;
    } catch (error) {
      throw new Error("Error calculating derivative: " + error.message);
    }
  };

  const performNewtonRaphson = (equation, xo, derivativeExpr) => {
    const iterations = [];
    let xn = xo;
  
    const evaluateEquation = (equation, x) => {
      try {
        return evaluate(equation, { x });
      } catch (error) {
        throw new Error("Error evaluating equation: " + error.message);
      }
    };
  
    const evaluateDerivative = (derivativeExpr, x) => {
      try {
        return derivativeExpr.evaluate({ x });
      } catch (error) {
        throw new Error("Error evaluating derivative: " + error.message);
      }
    };
  
    const maxIterations = 100;
    let i = 0;
    let prevRelativeError = null;
  
    while (true) {
      if (i === 0) {
        const fx = evaluateEquation(equation, xn);
        const fpx = evaluateDerivative(derivativeExpr, xn);
        iterations.push({
          iteration: i + 1,
          x: xo,
          fx: fx.toFixed(roundOff),
          fpx: fpx.toFixed(roundOff),
          relativeError: "", // First iteration has no relative error
        });
        i++;
        continue;
      }
  
      const fx = evaluateEquation(equation, xn);
      const fpx = evaluateDerivative(derivativeExpr, xn);
      const xNext = xn - fx / fpx;
      const relativeError = Math.abs((xNext - xn) / xNext) * 100;
  
      iterations.push({
        iteration: i + 1,
        x: xNext.toFixed(roundOff),
        fx: fx.toFixed(roundOff),
        fpx: fpx.toFixed(roundOff),
        relativeError: prevRelativeError ? prevRelativeError.toFixed(roundOff) : "", // Previous relative error
      });
  
      if (relativeError <= 0.0000 || i >= maxIterations) {
        break;
      }
  
      prevRelativeError = relativeError;
      xn = xNext;
      i++;
    }

    // Shift iterations to remove the second iteration and replace it with subsequent values
    if (iterations.length > 1) {
      for (let j = 1; j < iterations.length - 1; j++) {
        iterations[j] = iterations[j + 1];
        iterations[j].iteration = j + 1;
      }
      iterations.pop();
    }

    return iterations;
  };

  return (
    <div>
      <h2 className="container mx-auto text-xl font-bold mb-2">Newton-Raphson Method</h2>
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto mb-4">
          <label htmlFor="equation" className="container mx-auto block mb-1">
            Equation:
          </label>
          <input
            type="text"
            id="equation"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="container mx-auto border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="container mx-auto mb-4">
          <label htmlFor="xo" className="container mx-auto block mb-1">
            Initial value for Xo:
          </label>
          <input
            type="text"
            id="xo"
            value={xo}
            onChange={(e) => setXo(e.target.value)}
            className="container mx-auto border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="flex mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Solve
        </button>
      </form>
      {equationDerivative && (
        <div className="mt-4">
          <h2 className="container mx-auto text-lg font-bold">Derivative: {equationDerivative}</h2>
        </div>
      )}
      {iterationData.length > 0 && (
        <div className="mt-8">
          <h2 className="container mx-auto text-lg font-bold mb-4">Iteration Table</h2>
          <table className="container mx-auto w-full border-collapse border border-gray-800">
            <thead>
              <tr>
                <th className="border border-gray-800 px-4 py-2">Iteration</th>
                <th className="border border-gray-800 px-4 py-2">X</th>
                <th className="border border-gray-800 px-4 py-2">f(X)</th>
                <th className="border border-gray-800 px-4 py-2">f'(X)</th>
                <th className="border border-gray-800 px-4 py-2">Relative Error (%)</th>
              </tr>
            </thead>
            <tbody>
              {iterationData.map((iteration, index) => (
                <tr key={index}>
                  <td className="border border-gray-800 px-4 py-2">{iteration.iteration}</td>
                  <td className="border border-gray-800 px-4 py-2">{iteration.x}</td>
                  <td className="border border-gray-800 px-4 py-2">{iteration.fx}</td>
                  <td className="border border-gray-800 px-4 py-2">{iteration.fpx}</td>
                  <td className="border border-gray-800 px-4 py-2">{iteration.relativeError}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {root && (
        <div className="mt-4">
          <h2 className="container mx-auto text-lg font-bold">Root: {root}</h2>
        </div>
      )}
    </div>
  );
}

export default NewtonRaphson;
