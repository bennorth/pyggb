export const specs = [
  {
    label: "PerpendicularBisector(point, point)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-4, -1)
      k = PerpendicularBisector(p1, p2)
      y4 = Line(0, 4)
      print("y=4", Intersect(k, y4, 1))
    `,
    expOutputs: ["y=4 (-1, 4)"],
  },
  {
    label: "PerpendicularBisector(segment)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-4, -1)
      k = PerpendicularBisector(Segment(p1, p2))
      y4 = Line(0, 4)
      print("y=4", Intersect(k, y4, 1))
    `,
    expOutputs: ["y=4 (-1, 4)"],
  },
];
