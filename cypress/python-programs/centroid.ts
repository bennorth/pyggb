export const specs = [
  {
    label: "Centroid(polygon)",
    code: `
      p1 = Point(-4, -4)
      p2 = Point(-2, -4)
      p = Polygon(p1, p2, 4)
      p3 = Centroid(p)
      print("Centroid", p3)
    `,
    expOutputs: ["Centroid (-3, -3)"],
  },
];
