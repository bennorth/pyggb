export const specs = [
  {
    label: "Circle(Point, radius)",
    code: `
      A = Point(3, 4)
      k = Circle(A, 2)
      assert(k._ggb_type == "circle")
      l = Circle(A, Number(2))
      l.line_thickness = 8
      l.color = "red"
    `,
  },
  {
    label: "Circle(Point, Point)",
    code: `
      A = Point(3, 2)
      B = Point(6, 2)
      k = Circle(A, B)
      assert(k._ggb_type == "circle")
      print("radius =", k.radius)
    `,
    expOutputs: ["radius = 3.0"],
  },
  {
    label: "Circle(Point, Point, Point)",
    code: `
      A = Point(2, 0)
      B = Point(0, 2)
      C = Point(-2, 0)
      k = Circle(A, B, C)
      assert(k._ggb_type == "circle")
      print("radius =", k.radius)
    `,
    expOutputs: ["radius = 2.0"],
  },
  {
    label: "Circle(Number, Number, Number)",
    code: `
      k = Circle(1, Number(2), 3.5, opacity=0.875)
      assert(k._ggb_type == "circle")
      print("radius =", k.radius)
      print("opacity =", k.opacity)
    `,
    expOutputs: ["radius = 3.5", "opacity = 0.875"],
  },
  {
    label: "Circle.free_copy()",
    code: `
      k = Circle(3, 4, 5)
      k1 = k.free_copy()
      assert(k1._ggb_type == "circle")
    `,
  },
];
