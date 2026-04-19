export const specs = [
  {
    label: "FitPoly()",
    code: `
      # Points on y = x^2 + 3
      A = Point(0, 3)
      B = Point(2, 7)
      C = Point(-1, 4)
      f = FitPoly([A, B, C], 2)
      print(f"f(3) =", f(3).value)
    `,
    expOutputs: ["f(3) = 12.0"],
  },
];
