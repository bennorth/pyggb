export const specs = [
  {
    label: "FunctionGraph(expr)",
    code: `
      f = FunctionGraph("x^2 + 3x + 2.0")
      print("val =", f(2.0).value)
    `,
    expOutputs: ["val = 12.0"],
  },
  {
    label: "FunctionGraph(expr) == Parabola",
    code: `
      f = FunctionGraph("x^2 + 3x + 2.0")
      p = Parabola(1, 3, 2)
      print("Eq?", AreEqual(f, p).value)
    `,
    expOutputs: ["Eq? True"],
  },
  {
    label: "FunctionGraph(expr, lb, ub)",
    code: `
      f = FunctionGraph("x^2 + 3x + 2.0", -3, Number(4))
      print("val(3) =", f(3).value)
      print("val(8) =", f(8).value)
    `,
    expOutputs: ["val(3) = 20.0", "val(8) = nan"],
  },
  {
    label: "FunctionGraph.latex",
    code: `
      print(FunctionGraph("x + sin(x)").latex)
    `,
    expOutputs: ["x + \\operatorname{sin} \\left( x \\right)"],
  },
];
