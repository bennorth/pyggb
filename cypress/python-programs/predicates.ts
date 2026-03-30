const baseCode = `
  p1 = Point(2, 3)
  p1t = Point(3, 4)
  p2 = Point(-3, 2)
  p2t = Point(-2, 3)
  p3 = Point(-2, -3)
  p3t = Point(-1, -2)
  p4 = Point(3, -2)
  p5 = Point(5, 2)
  p6 = Point(-5, 2)

  k1 = Line(Point(6, 4), Point(-3, -2))
  k1t = Line(Point(8, 4), Point(-1, -2))
  k1a = Line(Point(6, 4), Point(-3, -2))
  k2 = Line(Point(-2, -4), Point(1, 2))
  k2p = Line(Point(4, -2), Point(-2, 1))
  k3 = Line(Point(3, -9), Point(-1, 3))
  k4 = Line(Point(1, 1), p5)

  t1 = Polygon([p1, p2, p3])
  t2 = Polygon([p1t, p2t, p3t])

`;

function predicateSpec(label: string, pythonExpr: string, expValue: boolean) {
  return {
    label,
    code: baseCode + `  print("result =", ${pythonExpr}.value)\n`,
    expOutputs: [`result = ${expValue ? "True" : "False"}`],
  };
}

export const specs = [
  predicateSpec("AreCollinear() f", "AreCollinear(p1, p2, p3)", false),
  predicateSpec("AreCollinear() t", "AreCollinear(p2, p5, p6)", true),
  predicateSpec("AreConcurrent() f", "AreConcurrent(k1, k2, k4)", false),
  predicateSpec("AreConcurrent() t", "AreConcurrent(k1, k2, k3)", true),
  predicateSpec("AreConcyclic() f", "AreConcyclic(p1, p2, p5, p6)", false),
  predicateSpec("AreConcyclic() t", "AreConcyclic(p1, p2, p3, p4)", true),
  predicateSpec("AreCongruent(line) t", "AreCongruent(k1, k2)", true),
  predicateSpec("AreCongruent(point) t", "AreCongruent(p2, p3)", true),
  predicateSpec("AreCongruent(polygon) t", "AreCongruent(t1, t2)", true),
  predicateSpec("AreCongruent(mix) f", "AreCongruent(p2, k2)", false),
  predicateSpec("AreEqual(line) f", "AreEqual(k1, k2)", false),
  predicateSpec("AreEqual(point) f", "AreEqual(p2, p3)", false),
  predicateSpec("AreEqual(point) t", "AreEqual(k1, k1a)", true),
  predicateSpec("AreEqual(polygon) f", "AreEqual(t1, t2)", false),
  predicateSpec("AreEqual(mix) f", "AreEqual(p2, k2)", false),
  predicateSpec("AreParallel() f", "AreParallel(k1, k2)", false),
  predicateSpec("AreParallel() t", "AreParallel(k1, k1t)", true),
  predicateSpec("ArePerpendicular() f1", "ArePerpendicular(k1, k2)", false),
  predicateSpec("ArePerpendicular() f2", "ArePerpendicular(k1, k1t)", false),
  predicateSpec("ArePerpendicular() t", "ArePerpendicular(k2, k2p)", true),
];
