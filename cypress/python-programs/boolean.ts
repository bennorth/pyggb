export const specs = [
  {
    label: "Boolean",
    code: `
      x = Boolean(True)
      assert(x._ggb_type == "boolean")
      print("x1 =", x.value)
      x.value = False
      print("x2 =", x.value)
    `,
    expOutputs: ["x1 = True", "x2 = False"],
  },
  {
    label: "Boolean.free_copy()",
    code: `
      A = Point(3, 4)
      p = Function.compare_LT(A.x_number, A.y_number)
      p1 = p.free_copy()
      assert(p1._ggb_type == "boolean")
    `,
  },
  {
    label: "Boolean.latex",
    code: `
      print("False", Boolean(False).latex)
      print("True", Boolean(True).latex)
    `,
    expOutputs: ["False false", "True true"],
  },
];
