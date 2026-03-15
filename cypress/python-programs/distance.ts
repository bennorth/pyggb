export const specs = [
  {
    label: "Distance(Point, Point)",
    code: `
      A = Point(-3, 0)
      B = Point(0, -4)
      print("AB =", Distance(A, B))
    `,
    expOutputs: ["AB = 5.0"],
  },
  {
    label: "Distance(Point, Line)",
    code: `
      A = Point(2, -2)
      B = Point(-4, 0)
      C = Point(0, 4)
      k = Line(B, C)
      d = Distance(A, k)
      print(f"Ak = {d:.4f}")
    `,
    expOutputs: ["Ak = 5.6569"], // 4√2
  },
  {
    label: "Distance(Point, Polygon)",
    code: `
      A = Point(2, -2)
      B = Point(-1, 2)
      C = Point(-0.5, 3)
      p = Polygon(B, C, 6)
      d = Distance(A, p)
      print("Ap =", d)
    `,
    expOutputs: ["Ap = 5.0"], // Nearest point is vertex B
  },
];
