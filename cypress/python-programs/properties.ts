export const specs = [
  {
    label: "Work with is_visible property",
    code: `
        c = Circle(0, 0, 3)
        p = Point(-2, -3, is_visible=False)
        q = Point(3, 2, is_visible=False)
        k = Line(p, q)
        a = Parabola(1.0, -2.0, -3.0)
        h = Polygon(p, q, 6)
        s = Segment(p, q)
        v = Slider(1, 5)

        for x in [c, k, a, h, s, v]:
            x.is_visible = False
      `,
  },
  {
    label: "Get/set color as numeric triple",
    code: `
        A = Point(3, 4)
        A.color = (0.25, 0.5, 0.125)
        assert(A.color == "#408020")
        for exp_v, got_v in zip([64/255, 128/255, 32/255], A.color_floats):
          assert(abs(got_v - exp_v) < 1.0e-10)
        A.color = [0, 0.5, 1]
        assert(A.color == "#0080FF")
      `,
  },
];
