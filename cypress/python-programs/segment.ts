export const specs = [
  {
    label: "Segment(Point, Point)",
    code: `
      A = Point(3, 0)
      B = Point(0, 4)
      k = Segment(A, B, line_thickness=8)
      assert(k._ggb_type == "segment")
      print("length =", k.length)
      print("thickness =", k.line_thickness)
    `,
    expOutputs: ["length = 5.0", "thickness = 8"],
  },
  {
    label: "Segment.free_copy()",
    code: `
      A = Point(3, 4)
      B = Point(1, 1)
      s = Segment(A, B)
      s1 = s.free_copy()
      assert(s1._ggb_type == "segment")
    `,
  },
  {
    label: "Segment.line_style",
    code: `
      A = Point(3, 4)
      B = Point(1, 1)
      s = Segment(A, B)
      s.line_style = 2
      assert(s.line_style == 2)
    `,
  },
];
