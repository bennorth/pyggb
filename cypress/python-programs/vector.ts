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
  {
    label: "Vector.line_Style",
    code: `
      A = Point(3, 4)
      B = Point(1, 1)
      v = Vector(A, B, line_style=3)
      assert(v.line_style == 3)
    `,
  },
  {
    label: "Vector arithmetic",
    code: `
      def assert_vector_components(v, x, y):
        assert v.x == x
        assert v.y == y

      v = Vector(3, 4)
      w = Vector(-1, -5)

      assert_vector_components(v + 8, 11, 12)
      assert_vector_components(v - 5, -2, -1)
      assert_vector_components(v * 2, 6, 8)
      assert_vector_components(v / 2, 1.5, 2)

      assert_vector_components(8 + v, 11, 12)
      assert_vector_components(5 - v, 2, 1)
      assert_vector_components(2 * v, 6, 8)

      assert_vector_components(-v, -3, -4)

      assert_vector_components(v + w, 2, -1)
      assert_vector_components(v - w, 4, 9)

      # Division produces a complex number, which cannot
      # be wrapped.  Modulus is unsupported.
    `,
  },
  {
    label: "Vector.latex",
    code: `
      A = Point(3, 1)
      B = Point(1, 4)
      print(Vector(A, B).latex)
    `,
    expOutputs: ["(-2, 3)"],
  },
];
