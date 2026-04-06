export const specs = [
  {
    label: "TriangleCenter(p1, p2, p3, kind)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(3, 3)
      p3 = Point(5, 2)
      q = TriangleCenter(p1, p2, p3, "centroid")
      print(q.x, q.y)
    `,
    expOutputs: ["4.0 2.0"],
  },
  {
    label: "TriangleCenter within Polygon",
    code: `
      p1 = Point(4, 1, color="red")
      p2 = Point(3, 3, color="red")
      p3 = Point(5, 2, color="red")
      q1 = Point(1, 0)
      q2 = Point(3, 0)
      q3 = Point(1, 3)
      q4 = Point(0, 1)
      pg = Polygon([q1, q2, TriangleCenter(p1, p2, p3, "centroid"), q3, q4])
      print("Area", pg.area)
    `,
    // Pick's theorem:
    expOutputs: ["Area 8.0"],
  },
];
