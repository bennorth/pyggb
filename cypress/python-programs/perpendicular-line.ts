export const specs = [
  {
    label: "PerpendicularLine(point, line)",
    code: `
      p1 = Point(4, 1)
      k1 = Line(1, 1)
      k = PerpendicularLine(p1, k1)
      y4 = Line(0, 4)
      print("y=4", Intersect(k, y4, 1))
    `,
    expOutputs: ["y=4 (1, 4)"],
  },
  {
    label: "PerpendicularLine(point, segment)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, -1)
      p3 = Point(3, 3)
      k1 = Segment(p2, p3)
      k = PerpendicularLine(p1, k1)
      y4 = Line(0, 4)
      print("y=4", Intersect(k, y4, 1))
    `,
    expOutputs: ["y=4 (1, 4)"],
  },
  {
    label: "PerpendicularLine(point, vector)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, -1)
      p3 = Point(3, 3)
      k1 = Vector(p2, p3)
      k = PerpendicularLine(p1, k1)
      y4 = Line(0, 4)
      print("y=4", Intersect(k, y4, 1))
    `,
    expOutputs: ["y=4 (1, 4)"],
  },
];
