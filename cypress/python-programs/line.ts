export const specs = [
  {
    label: "Line(Point, Point)",
    code: `
      A = Point(3, 4)
      B = Point(2, 1)
      k = Line(A, B)
      assert(k._ggb_type == "line")
      k.line_thickness = 8
      k.color = "blue"
    `,
  },
  {
    label: "Line(m, c)",
    code: `
      k = Line(0.5, 3, line_thickness=8)
      assert(k._ggb_type == "line")
    `,
  },
  {
    label: "Line.free_copy()",
    code: `
      A = Point(3, 4)
      B = Point(2, 1)
      k = Line(A, B)
      k1 = k.free_copy()
      assert(k1._ggb_type == "line")
    `,
  },
];
