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
  {
    label: "Function log variants",
    code: `
      import math

      def assert_close(v1, v2):
        assert abs(v1 - v2) <= 1.0e-10

      x = Number(1.0)
      log_3 = Function.log(Number(3.0), x)
      log_e = Function.ln(x)
      log_10 = Function.log10(x)
      log_2 = Function.log2(x)

      assert log_3.value == 0.0
      assert log_e.value == 0.0
      assert log_10.value == 0.0
      assert log_2.value == 0.0

      x.value = 123.0
      assert_close(log_3.value, math.log(123.0, 3.0))
      assert_close(log_e.value, math.log(123.0))
      assert_close(log_10.value, math.log(123.0, 10.0))
      assert_close(log_2.value, math.log(123.0, 2.0))
    `,
  },
];
