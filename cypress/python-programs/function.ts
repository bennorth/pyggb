export const specs = [
  {
    label: "Function.sin/cos",
    code: `
      import math
      sin_pi_3 = Function.sin(Number(math.pi / 3.0)).value
      cos_pi_3 = Function.cos(Number(math.pi / 3.0)).value
      print(f"sin = {sin_pi_3:.4f}")
      print(f"cos = {cos_pi_3:.4f}")
    `,
    expOutputs: ["sin = 0.8660", "cos = 0.5000"],
  },
];
