export const specs = [
  {
    label: "Vector(Point, Point)",
    code: `
      A = Point(3, 0)
      B = Point(0, 4)
      v1 = Vector(A, B)
      assert(v1._ggb_type == "vector")
      v1.line_thickness = 8
      v1.color = "red"
    `,
  },
  {
    label: "Vector(Number, Number)",
    code: `
      v1 = Vector(3, 4)
      assert(v1._ggb_type == "vector")
      v2 = Vector(2, Number(1))
      v3 = Vector(Number(4), -1)
      v4 = Vector(Number(3), Number(-2))
    `,
  },
  {
    label: "Vector.free_copy()",
    code: `
      A = Point(3, 4)
      B = Point(1, 1)
      v = Vector(A, B)
      v1 = v.free_copy()
      assert(v1._ggb_type == "vector")
    `,
  },
];
