const withCentreSpec = (label: string, thetaCode: string) => ({
  label,
  code: `
      import math
      A = Point(3, 4)
      C = Point(1, 2)
      th = ${thetaCode}
      D = Rotate(A, th, C)
      print(f"D = ({D.x:.4f}, {D.y:.4f})")
    `,
  expOutputs: ["D = (-1.0000, 4.0000)"],
});

export const specs = [
  {
    label: "Rotate(Vector)",
    code: `
      import math
      A = Point(1, 3)
      v = Vector(2, 0)
      B = A + Rotate(v, math.pi / 4.0)
      print(f"B = ({B.x:.4f}, {B.y:.4f})")
    `,
    expOutputs: ["B = (2.4142, 4.4142)"],
  },
  withCentreSpec("Rotate(obj, theta-number, centre)", "math.pi / 2"),
  withCentreSpec("Rotate(obj, theta-number, centre)", "Angle(math.pi / 2)"),
];
