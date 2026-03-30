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

export const specs = [
  pointEllipse(0, 0),
  pointEllipse(-2, 1),
  pointEllipse(-4, 2),
  lineEllipse,
  ellipseEllipse(0, 0),
  ellipseEllipse(1, 1),
  ellipseEllipse(5, 3),
  ellipseEllipse(7, 4),
];
