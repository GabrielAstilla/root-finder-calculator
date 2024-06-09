import React, { useState } from "react";
import { evaluate } from "mathjs";

const FalsePositionMethod = () => {
  const [equation, setEquation] = useState("");
  const [xl, setXl] = useState("");
  const [xr, setXr] = useState("");
  const [precision, setPrecision] = useState("");
  const [roundOff, setRoundOff] = useState(5);
  const [iterationData, setIterationData] = useState([]);
  const [root, setRoot] = useState(null);
  const [fxRoot, setFxRoot] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!equation || !xl || !xr || !precision) {
      alert("Please fill in all fields.");
      return;
    }

    const xlNum = parseFloat(xl);
    const xrNum = parseFloat(xr);
    const precisionNum = parseFloat(precision);
    const roundOffNum = parseInt(roundOff);

    const { iterations, root, fxRoot } = performFalsePositionMethod(
      equation,
      xlNum,
      xrNum,
      precisionNum,
      roundOffNum
    );
    setIterationData(iterations);
    setRoot(root);
    setFxRoot(fxRoot);
  };

  const performFalsePositionMethod = (
    equation,
    xl,
    xr,
    precision,
    roundOff
  ) => {
    let iteration = 0;
    let xlVal = parseFloat(xl);
    let xrVal = parseFloat(xr);
    let lastTwoYmValues = [];
    let iterate = [];

    while (iteration < 100) {
      iteration++;

      let yl = evaluateEquation(equation, xlVal);
      let yr = evaluateEquation(equation, xrVal);

      let xm = xlVal + (xrVal - xlVal) * (yl / (yl - yr));
      let ym = evaluateEquation(equation, xm);

      iterate.push({
        iteration: iteration,
        xl: xlVal.toFixed(roundOff),
        xr: xrVal.toFixed(roundOff),
        xm: xm.toFixed(roundOff),
        yl: yl.toFixed(roundOff),
        yr: yr.toFixed(roundOff),
        ym: ym.toFixed(roundOff),
      });

      lastTwoYmValues.push(ym);
      if (lastTwoYmValues.length > 2) {
        lastTwoYmValues.shift();
      }

      if (
        iteration > 1 &&
        Math.abs(lastTwoYmValues[1] - lastTwoYmValues[0]) < precision
      ) {
        break;
      }

      if (ym === 0.0) {
        break;
      } else if (ym * yl < 0) {
        xrVal = xm;
      } else {
        xlVal = xm;
      }
    }

    const root = iteration === 100 ? "Not found" : iterate[iteration - 1].xm;
    const fxRoot =
      iteration === 100 ? "Not found" : iterate[iteration - 1].ym;

    return {
      iterations: iterate,
      root: root,
      fxRoot: fxRoot,
    };
  };

  const evaluateEquation = (expression, x) => {
    return evaluate(expression.replace(/x/g, `(${x})`));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">False Position Method</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="equation" className="block mb-1">
            Equation:
          </label>
          <input
            type="text"
            id="equation"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            placeholder="Enter equation (e.g., x^3-x-2)"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="xl" className="block mb-1">
            Initial value for XL:
          </label>
          <input
            type="number"
            id="xl"
            value={xl}
            onChange={(e) => setXl(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            placeholder="Enter XL"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="xr" className="block mb-1">
            Initial value for XR:
          </label>
          <input
            type="number"
            id="xr"
            value={xr}
            onChange={(e) => setXr(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            placeholder="Enter XR"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="precision" className="block mb-1">
            Precision:
          </label>
          <input
            type="number"
            id="precision"
            value={precision}
            onChange={(e) => setPrecision(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            placeholder="Enter precision"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roundOff" className="block mb-1">
            Round off (to decimal places):
          </label>
          <input
            type="number"
            id="roundOff"
            value={roundOff}
            onChange={(e) => setRoundOff(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            placeholder="Enter number of decimal places"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Solve
        </button>
      </form>

      {iterationData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Iteration Table</h2>
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr>
                <th className="border border-gray-800 px-4 py-2">Iterations</th>
                <th className="border border-gray-800 px-4 py-2">XL</th>
                <th className="border border-gray-800 px-4 py-2">XM</th>
                <th className="border border-gray-800 px-4 py-2">XR</th>
                <th className="border border-gray-800 px-4 py-2">YL</th>
                <th className="border border-gray-800 px-4 py-2">YM</th>
                <th className="border border-gray-800 px-4 py-2">YR</th>
              </tr>
            </thead>
            <tbody>
            {iterationData.map((iteration, index) => (
            <tr key={index}>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.iteration}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.xl}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.xm}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.xr}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.yl}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.ym}
              </td>
              <td className="border border-gray-800 px-4 py-2">
                {iteration.yr}
              </td>
            </tr>
          ))}
          </tbody>
          </table>
          {root && fxRoot && (
            <div className="mt-4">
              <h2 className="text-lg font-bold">Root: {root}</h2>
              <h2 className="text-lg font-bold">f(x): {fxRoot}</h2>
            </div>
          )}
          </div>
          )}
          </div>
          );
          };

          export default FalsePositionMethod;

