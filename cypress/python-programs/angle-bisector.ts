export const specs = [
  {
    label: "AngleBisector(line, line)",
    code: `
      k1 = Line(Point(1, 4), Point(-1, -4))
      k2 = Line(Point(4, -1), Point(-4, 1))
      k3, k4 = AngleBisector(k2, k1)

      k5 = Line(0, 3)
      p1 = Intersect(k5, k3, 1)
      print('y=3', f"({p1.x:.4f}, {p1.y:.4f})")

      k6 = Line(0, 5)
      p2 = Intersect(k6, k4, 1)
      print('y=5', f"({p2.x:.4f}, {p2.y:.4f})")
    `,
    expOutputs: ["y=3 (5.0000, 3.0000)", "y=5 (-3.0000, 5.0000)"],
  },
  {
    label: "AngleBisector(point, point, point)",
    code: `
      p1 = Point(-4, 2)
      p2 = Point(-4, -4)
      p3 = Point(2, -4)
      k1 = AngleBisector(p1, p2, p3)

      k2 = Line(0, 1)
      print("y=1", Intersect(k1, k2, 1))
    `,
    expOutputs: ["y=1 (1, 1)"],
  },
];
