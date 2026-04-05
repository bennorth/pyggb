export const specs = [
  {
    label: "Point(x, y, kwargs)",
    code: `
      A = Point(3, 4, color="#f00", size=8)
      assert(A._ggb_type == "point")
      B = Point(1, -5, is_visible=False)
      print(A.color)
    `,
    expOutputs: ["#FF0000"],
  },
  {
    label: "Point(line, param)",
    code: `
      A = Point(0, 0)
      B = Point(4, 4)
      k = Segment(A, B)
      C = Point(k, 0.25)
      assert(C.x == 1.0 and C.y == 1.0)
    `,
  },
  {
    label: "Point(object)",
    code: `
      A = Point(0, 0)
      B = Point(4, 4)
      k = Segment(A, B)
      C = Point(k)
      assert(C.x == C.y)
      assert(C.x >= 0.0)
      assert(C.x <= 4.0)
    `,
  },
  {
    label: "Point.free_copy()",
    code: `
      A = Point(3, 4)
      A1 = A.free_copy()
      assert(A1._ggb_type == "point")
      A.x = 4
      A1.x = 2
    `,
  },
  {
    label: "Point.is_fixed",
    code: `
      A = Point(3, 4)
      B = Point(1, 2, is_fixed=True)
      assert(not A.is_fixed)
      assert(B.is_fixed)
    `,
  },
  {
    label: "Point.latex",
    code: `
      print(Point(3, 4).latex)
    `,
    expOutputs: ["\\left(3,\\;4 \\right)"],
  },
];
