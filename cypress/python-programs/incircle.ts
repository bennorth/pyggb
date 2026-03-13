export const specs = [
  {
    label: "Incircle(point, point, point)",
    code: `
      import math

      p1 = Point(-5, -5)
      p2 = Point(5, -5)
      p3 = Point(0, 3)

      k = Incircle(p1, p2, p3)

      d1 = Distance(p1, p2)
      d2 = Distance(p2, p3)
      d3 = Distance(p3, p1)
      s = (d1 + d2 + d3) / 2

      r = k.radius
      r1 = math.sqrt((s - d1) * (s - d2) * (s - d3) / s)

      print("Radii agree?", abs(r - r1) < 1.0e-9)
    `,
    expOutputs: ["Radii agree? True"],
  },
];
