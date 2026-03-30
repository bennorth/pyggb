export const specs = [
  {
    label: "Parabola(Point, Line)",
    code: `
      A = Point(0, Number(-4))
      k = Line(Point(-1, -5), Point(1, -5))
      p = Parabola(A, k, color="red")
      assert(p._ggb_type == "parabola")
      p.line_thickness = 8
      p.color = "red"
    `,
  },
  {
    label: "Parabola(a, b, c)",
    code: `
      p = Parabola(2, 1, -2)
      assert(p._ggb_type == "parabola")
      A = Point(-0.25, -4)
      assert(Distance(A, p) == 1.875)
    `,
  },
  {
    label: "Parabola.free_copy()",
    code: `
      A = Point(3, 4)
      B = Point(1, 1)
      C = Point(-1, 1)
      k = Line(B, C)
      c = Parabola(A, k)
      c1 = c.free_copy()
      assert(c1._ggb_type == "parabola")
    `,
  },
  {
    label: "Parabola.line_style",
    code: `
      p = Parabola(2, 1, -2)
      p.line_style = 1
      assert(p.line_style == 1)
    `,
  },
];
