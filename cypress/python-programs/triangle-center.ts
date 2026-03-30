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
];
