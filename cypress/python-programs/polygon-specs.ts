const kOctagonVertices = [
  [1, 0],
  [2, 0],
  [3, 1],
  [3, 2],
  [2, 3],
  [1, 3],
  [0, 2],
  [0, 1],
];

type ValueFun = (points: Array<Array<number>>) => number;

export function newPolygonSpecs(ggbFunctionName: string, valueFun: ValueFun) {
  return [3, 4, 5, 6, 7, 8].map((nSides) => {
    const range = Array.from({ length: nSides }).map((_, idx) => idx);

    const pointDefns = range
      .map((idx) => {
        const point = kOctagonVertices[idx];
        return `  p${idx} = Point(${point[0]}, ${point[1]})`;
      })
      .join("\n");

    const argsStr = range.map((idx) => `p${idx}`).join(",");

    const tailCode = [
      `  k = Polygon([${argsStr}])`,
      `  d = ${ggbFunctionName}(k).value`,
      "  print('%.0f' % (d * 100000))",
      "  ",
    ].join("\n");

    const code = `\n${pointDefns}\n${tailCode}`;

    const expValue = valueFun(kOctagonVertices.slice(0, nSides));

    const expScaledValueStr = Math.round(100000 * expValue).toString();

    return {
      label: `${ggbFunctionName} (${nSides}-gon)`,
      code,
      expOutputs: [expScaledValueStr],
    };
  });
}
