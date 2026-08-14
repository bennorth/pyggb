export const specs = [
  {
    label: "RigidPolygon(poly)",
    code: `
      p1 = Polygon(Point(0, 0), Point(2, 0), 4)
      p2 = RigidPolygon(p1)
    `,
  },
  {
    label: "RigidPolygon(poly, dx, dy)",
    code: `
      p1 = Polygon(Point(0, 0), Point(2, 0), 4)
      p2 = RigidPolygon(p1, -5, -5)
      pc = Centroid(p2)
      print(f"centroid {pc.x:.4f} {pc.y:.4f}")
    `,
    expOutputs: ["centroid -4.0000 -4.0000"],
  },
  {
    label: "RigidPolygon(points)",
    code: `
      A1 = Point(0, 0)
      A2 = Point(2, 0)
      A3 = Point(2, 1)
      A4 = Point(1, 2)
      p1 = RigidPolygon([A1, A2, A3, A4])
    `,
  },
];
