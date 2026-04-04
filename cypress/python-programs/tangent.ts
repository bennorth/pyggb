const pointEllipse = (x: number, expNTangents: number) => ({
  label: `Tangent(point, ellipse) ${expNTangents}`,
  code: `
      p = Point(${x}, 0)
      c1 = Ellipse(Point(4, 0), Point(8, 0), 8)
      tangents = Tangent(p, c1)
      print("got", len(tangents))
    `,
  expOutputs: [`got ${expNTangents}`],
});

const ellipseEllipse = (xOffset: number, expNTangents: number) => ({
  label: `Tangent(point, ellipse) ${expNTangents}`,
  code: `
      c2 = Ellipse(Point(-3 + ${xOffset}, 0), Point(-1 + ${xOffset}, 0), 2)
      c1 = Ellipse(Point(-4, 0), Point(0, 0), 3)
      tangents = Tangent(c1, c2)
      print("got", len(tangents))
    `,
  expOutputs: [`got ${expNTangents}`],
});

const lineEllipse = {
  label: "Tangent(line, ellipse)",
  code: `
    k = Line(0, 11)
    c1 = Ellipse(Point(0, -4), Point(0, 4), 8)
    print("got", len(Tangent(k, c1)))
    `,
  expOutputs: ["got 2"],
};

const toFunctionCode = (codeNubLines: Array<string>) => `
  f = FunctionGraph("(0.125)x^3 + x^2 + x + 1")
  ${codeNubLines.join("\n  ")}
  yax = Line(Point(0, -1), Point(0, 1))
  icpt = Intersect(k, yax, 1).y
  print("icpt =", icpt)
`;

const kToFunctionExpOutputs = ["icpt = -1.0"];

const pointFunction = {
  label: "Tangent(point, function)",
  code: toFunctionCode(["Q = Point(-2, -3)", "k = Tangent(Q, f)"]),
  expOutputs: kToFunctionExpOutputs,
};

const numberFunction = {
  label: "Tangent(number, function)",
  code: toFunctionCode(["k = Tangent(-2, f)"]),
  expOutputs: kToFunctionExpOutputs,
};

export const specs = [
  pointEllipse(0, 0),
  pointEllipse(-2, 1),
  pointEllipse(-4, 2),
  lineEllipse,
  ellipseEllipse(0, 0),
  ellipseEllipse(1, 1),
  ellipseEllipse(5, 3),
  ellipseEllipse(7, 4),
  pointFunction,
  numberFunction,
];
