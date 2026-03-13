const conicSpecs = [
  {
    label: "Perimeter(circle)",
    code: `
      p1 = Point(4, 1)
      k = Circle(p1, 2.0)
      print("Perimeter %.4f" % Perimeter(k).value)
    `,
    expOutputs: ["Perimeter 12.5664"],
  },
  {
    label: "Perimeter(ellipse)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, 0)
      p3 = Point(2, 3)
      k = Ellipse(p1, p2, p3)
      Perimeter(k)  # Ignore
    `,
  },
];

// Not entirely clear that the following is better than just writing all
// the cases out, but anyway.

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

const polygonSpecs = [3, 4, 5, 6, 7, 8].map((nSides) => {
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
    "  d = Perimeter(k).value",
    "  print('%.0f' % (d * 100000))",
    "  ",
  ].join("\n");

  const code = `\n${pointDefns}\n${tailCode}`;

  const expPerimeter = range
    .map((idx) => {
      const p0 = kOctagonVertices[idx];
      const p1 = kOctagonVertices[(idx + 1) % nSides];
      return Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    })
    .reduce((a, b) => a + b, 0.0);

  const expScaledPerimeterStr = Math.round(100000 * expPerimeter).toString();

  return {
    label: `Perimeter (${nSides}-gon)`,
    code,
    expOutputs: [expScaledPerimeterStr],
  };
});

export const specs = [...conicSpecs, ...polygonSpecs];
