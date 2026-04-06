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
    label: "Circle(Point, segment)",
    code: `
      A = Point(3, 4)
      s = Segment(Point(1, 1), Point(4, 5))
      k = Circle(A, s)
      assert(k._ggb_type == "circle")
      assert(k.radius == 5.0)
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
  {
    label: "Circle.line_style",
    code: `
      k = Circle(3, 4, 5)
      k.line_style = 2
      assert(k.line_style == 2)
    `,
  },
  {
    label: "Circle.latex",
    code: `
      print(Circle(1, 2, 3).latex)
    `,
    expOutputs: ["(x - 1)^{2} + (y - 2)^{2} = 9"],
  },
  {
    label: "Circle.center",
    code: `
      k = Circle(1, 2, 3)
      c1 = k.center
      c2 = k.center
      assert c1._ggb_label == c2._ggb_label
      assert c1.x == 1
      assert c1.y == 2
    `,
  },
];
