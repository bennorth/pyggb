export const specs = [
  {
    label: "Midpoint(point, point)",
    code: `
      p1 = Point(3, 4)
      p2 = Point(-1, -2)

      m1 = Midpoint(p1, p2)
      print("Midpoint", m1)
    `,
    expOutputs: ["Midpoint (1, 1)"],
  },
  {
    label: "Midpoint(segment)",
    code: `
      p1 = Point(3, 4)
      p2 = Point(-1, -2)

      m1 = Midpoint(Segment(p1, p2))
      print("Midpoint", m1)
    `,
    expOutputs: ["Midpoint (1, 1)"],
  },
  {
    label: "Midpoint(ellipse)",
    code: `
      p1 = Point(3, 4)
      p2 = Point(-1, -2)

      m1 = Midpoint(Ellipse(p1, p2, Point(-1, 1)))
      print("Midpoint", m1)
    `,
    expOutputs: ["Midpoint (1, 1)"],
  },
  {
    label: "Midpoint(circle)",
    code: `
      p1 = Point(3, 4)
      p2 = Point(-1, -2)

      m1 = Midpoint(Circle(p1, p2))
      print("Midpoint", m1)
    `,
    expOutputs: ["Midpoint (3, 4)"],
  },
];
