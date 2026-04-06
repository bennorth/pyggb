import { propSettingSpecsFromNames } from "./prop-setting-specs";

const expOutputs = ["angle = 0.250000"];

export const oneArgSpecs = [
  {
    label: "Angle(point)",
    objCode: "Point(4, 4)",
  },
  {
    label: "Angle(vector)",
    objCode: "Vector(2, 2)",
  },
  {
    label: "Angle(ggb-number)",
    objCode: "Number(math.pi/4)",
  },
  {
    label: "Angle(py-number)",
    objCode: "math.pi/4",
  },
].map((protoSpec) => ({
  label: protoSpec.label,
  code: `
    import math
    obj = ${protoSpec.objCode}
    th1 = Angle(obj)
    print("angle = %.6f" % (th1.value / math.pi))
    `,
  expOutputs,
}));

const twoArgSpecs = [
  {
    label: "Angle(line, line)",
    code: `
      import math
      k1 = Line(Point(-2, 0), Point(0, 2))
      k2 = Line(Point(3, 4), Point(3, 5))
      th1 = Angle(k1, k2)
      print("angle = %.6f" % (th1.value / math.pi))
    `,
    expOutputs,
  },
  {
    label: "Angle(vector, vector)",
    code: `
      import math
      v1 = Vector(1, 1)
      v2 = Vector(0, 3)
      th1 = Angle(v1, v2)
      print("angle = %.6f" % (th1.value / math.pi))
    `,
    expOutputs,
  },
  {
    label: "Angle(point, point, point)",
    code: `
      import math
      p1 = Point(4, -1)
      p2 = Point(-2, -1)
      p3 = Point(1, 2)
      th1 = Angle(p1, p2, p3)
      print("angle = %.6f" % (th1.value / math.pi))
    `,
    expOutputs,
  },
];

const propSettingSpecs = propSettingSpecsFromNames([
  "opacity",
  "color",
  "caption",
]).map((protoSpec) => ({
  label: `Angle setting ${protoSpec.attrName}`,
  code: `
    P = Point(1, 3)
    Q = Point(4, 2)
    R = Point(5, 0)
    th1 = Angle(P, Q, R, ${protoSpec.attrName}=${protoSpec.setValue})
    print("attr", th1.${protoSpec.attrName})
  `,
  expOutputs: [`attr ${protoSpec.expValue}`],
}));

const arithmeticSpecs = [
  {
    label: "Angle arithmetic",
    code: `
      def assert_angle_value(th, x):
        assert abs(th.value - x) < 1.0e-10

      P = Point(1, 3)
      Q1 = Point(4, 2)
      Q2 = Point(3, 5)
      R = Point(5, 0)

      th = Angle(P, Q1, R)
      thRad = th.value

      ph = Angle(P, Q2, R)
      phRad = ph.value

      # In some cases, angles are treated as their radian measure.

      assert_angle_value(th + 0.25, thRad + 0.25)
      assert_angle_value(th - 0.25, thRad - 0.25)
      assert_angle_value(th * 20, thRad * 20.0)
      assert_angle_value(th / 20, thRad / 20.0)
      assert_angle_value(th ** 1.5, thRad ** 1.5)

      assert_angle_value(0.25 + th, 0.25 + thRad)
      assert_angle_value(1.75 - th, 1.75 - thRad)
      assert_angle_value(20 * th, 20.0 * thRad)
      assert_angle_value(1.5 ** th, 1.5 ** thRad)

      assert_angle_value(-th, -thRad)

      assert_angle_value(th + ph, thRad + phRad)
      assert_angle_value(th - ph, thRad - phRad)

      assert_angle_value(th * ph, thRad * phRad)
      assert_angle_value(th / ph, thRad / phRad)
      assert_angle_value(th % ph, thRad % phRad)
      assert_angle_value(th ** ph, thRad ** phRad)
    `,
  },
];

const latexSpec = {
  label: "Angle.latex",
  code: `
    P = Point(3, 0)
    Q = Point(0, 0)
    R = Point(0, 3)
    print(Angle(P, Q, R).latex)
  `,
  expOutputs: ["90°"],
};

export const specs = [
  ...oneArgSpecs,
  ...twoArgSpecs,
  ...propSettingSpecs,
  ...arithmeticSpecs,
  latexSpec,
];
