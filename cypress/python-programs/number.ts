export const specs = [
  {
    label: "Number",
    code: `
      x = Number(3.25)
      assert(x._ggb_type == "numeric")
      print("x1 =", x.value)
      x.value = 4.5
      print("x2 =", x.value)
    `,
    expOutputs: ["x1 = 3.25", "x2 = 4.5"],
  },
  {
    label: "Number ops",
    code: `
      x = Number(2.0)
      y = 4.0
      print((x + y).value == 6.0)
      print((y + x).value == 6.0)
      print((x - y).value == -2.0)
      print((y - x).value == 2.0)
      print((x * y).value == 8.0)
      print((y * x).value == 8.0)
      print((y / x).value == 2.0)
      print((x / y).value == 0.5)
      print((x ** y).value == 16.0)
      print((y ** x).value == 16.0)
    `,
    expNonOutputs: ["False"],
  },
  {
    label: "Number.free_copy()",
    code: `
      A = Point(3, 4)
      B = Number(3.0)
      x1 = A.x_number + B
      x2 = x1.free_copy()
      assert(x2._ggb_type == "numeric")
    `,
  },
  {
    label: "Number.latex",
    code: `
      print(Number(3).latex)
    `,
    expOutputs: ["3"],
  },
];
