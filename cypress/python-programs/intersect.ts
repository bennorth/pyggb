export const specs = [
  {
    label: "Intersect(line, line, number)",
    code: `
      A = Point(0, 0)
      B = Point(2, 4)
      k1 = Line(A, B)
      C = Point(2, 1)
      D = Point(0, 3)
      k2 = Line(C, D)
      E = Intersect(k1, k2, 1)
      print(f"E = ({E.x}, {E.y})")
    `,
    expOutputs: ["E = (1.0, 2.0)"],
  },
  {
    label: "Intersect(circle, circle, number)",
    code: `
      from operator import attrgetter
      k1 = Circle(Point(3, 0), 5)
      k2 = Circle(Point(-3, 0), 5)
      rawEs = [Intersect(k1, k2, i) for i in [1, 2]]
      Es = sorted(rawEs, key=attrgetter("y"))
      print(len(Es), "intersection/s")
      print(f"Es[0] = ({Es[0].x}, {Es[0].y})")
      print(f"Es[1] = ({Es[1].x}, {Es[1].y})")
    `,
    expOutputs: [
      "2 intersection/s",
      "Es[0] = (0.0, -4.0)",
      "Es[1] = (0.0, 4.0)",
    ],
  },
  {
    label: "Intersect(circle, circle)",
    code: `
      from operator import attrgetter
      k1 = Circle(Point(3, 0), 5)
      k2 = Circle(Point(-3, 0), 5)
      rawEs = Intersect(k1, k2)
      Es = sorted(rawEs, key=attrgetter("y"))
      print(len(Es), "intersection/s")
      print(f"Es[0] = ({Es[0].x}, {Es[0].y})")
      print(f"Es[1] = ({Es[1].x}, {Es[1].y})")
    `,
    expOutputs: [
      "2 intersection/s",
      "Es[0] = (0.0, -4.0)",
      "Es[1] = (0.0, 4.0)",
    ],
  },
  {
    label: "Intersect(ellipse, ellipse, number)",
    code: `
      import math

      A = Point(-2, 0)
      B = Point(2, 0)
      C = Point(0, -2)
      D = Point(0, 2)

      sma = 1.0 + math.sqrt(5.0)
      k1 = Ellipse(A, B, sma)
      k2 = Ellipse(C, D, sma)

      def print_4dp(p):
          print(f"({p.x:.04f}, {p.y:.04f})")

      print_4dp(Intersect(k1, k2, 1))
      print_4dp(Intersect(k1, k2, 2))
      print_4dp(Intersect(k1, k2, 3))
      print_4dp(Intersect(k1, k2, 4))
    `,
    expOutputs: [
      // Not necessarily in this order:
      "(2.0000, 2.0000)",
      "(2.0000, -2.0000)",
      "(-2.0000, 2.0000)",
      "(-2.0000, -2.0000)",
    ],
  },
  {
    label: "Intersect(circle, function, initial-point)",
    code: `
      a = FunctionGraph("x^3 + x^2 - x")
      b = Line(3/5, 4/5)
      c = Point(0.0, 0.8)
      p = Intersect(a, b, c)
      print(f"({p.x:.02f}, {p.y:.02f})")
    `,
    expOutputs: ["(-0.43, 0.54)"],
  },
];
