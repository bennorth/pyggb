export const specs = [
  {
    label: "Slider",
    code: `
      coeff_b = Slider(1, 5, increment=0.1)
      assert(coeff_b._ggb_type == "numeric")
      parabola = Parabola(1.5, coeff_b, 0)
      line = Line(1, 0)

      intersection = Intersect(parabola, line, 1)
      assert(intersection.x == 0.0)
      assert(intersection.y == 0.0)

      coeff_b.value = 4.0
      Es = [Intersect(parabola, line, i) for i in [1, 2]]
      assert(Es[0].x == 0.0)
      assert(Es[0].y == 0.0)
      assert(Es[1].x == -2.0)
      assert(Es[1].y == -2.0)
    `,
  },
  {
    label: "Slider.when_changed",
    code: `
      s = Slider(1.0, 5.0)

      @s.when_changed
      def print_s_value():
          print(f"slider is {s.value:.4f}")

      s.value = 2.5
    `,
    expOutputs: ["slider is 2.5000"],
  },
  {
    label: "Slider.caption",
    code: `
      s = Slider(1, 5, increment=0.1)
      s.caption = "Hello world"
      print(f"s label {s.label_visible} {s.label_style}")
      print(f"s caption {s.caption!r}")
    `,
    expOutputs: ["s label True 3", "s caption 'Hello world'"],
  },
  {
    label: "Slider/number operations",
    code: `
      s = Slider(2, 5, increment=0.1)
      transformed_sliders = [
          s + 8,
          s - 8,
          s * 8,
          s / 8,
          s % 8,
          s ** 8,
      ]
      exp_values = [10, -6, 16, 0.25, 2, 256]
      for u, exp_value in zip(transformed_sliders, exp_values):
        assert u.value == exp_value
    `,
  },
];
