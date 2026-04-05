export const specs = [
  {
    label: "Ellipse(Point, Point, Number)",
    code: `
      A = Point(2, 0)
      B = Point(-2, 0)
      k1 = Ellipse(A, B, Number(4.0), color="red")
      k2 = Ellipse(A, B, 3.0, opacity=0.8)
      assert(k1._ggb_type == "ellipse")
      assert(k2._ggb_type == "ellipse")
    `,
  },
  {
    label: "Ellipse(Point, Point, Segment)",
    code: `
      A = Point(2, 0)
      B = Point(-2, 0)
      s = Segment(Point(0, 0), Point(3, 4))
      k1 = Ellipse(A, B, s)
      assert(k1._ggb_type == "ellipse")
    `,
  },
  {
    label: "Ellipse(Point, Point, Point)",
    code: `
      A = Point(2, 0)
      B = Point(-2, 0)
      C = Point(4, 1)
      k1 = Ellipse(A, B, C)
      assert(k1._ggb_type == "ellipse")
    `,
  },
  {
    label: "Ellipse.line_style",
    code: `
      A = Point(2, 0)
      B = Point(-2, 0)
      C = Point(4, 1)
      k = Ellipse(A, B, C)
      k.line_style = 2
      assert(k.line_style == 2)
    `,
  },
  {
    label: "Ellipse.latex",
    code: `
      A = Point(0, 0)
      B = Point(0, 0)
      print(Ellipse(A, B, 3).latex)
    `,
    expOutputs: ["x^{2} + y^{2}\\, = \\,9"],
  },
  {
    label: "Ellipse.center",
    code: `
      A = Point(3, 3)
      B = Point(-1, 5)
      k = Ellipse(A, B, 3)
      c1 = k.center
      c2 = k.center
      assert c1._ggb_label == c2._ggb_label
      assert c1.x == 1
      assert c1.y == 4
    `,
  },
];
