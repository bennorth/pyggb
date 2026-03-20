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

export const specs = [...oneArgSpecs, ...twoArgSpecs];
