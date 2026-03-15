export const specs = [
  {
    label: "Polygon(Array<Points>)",
    code: `
      A = Point(3, 0)
      B = Point(0, 4)
      C = Point(-2, 1)
      D = Point(-1, -3)
      p = Polygon([A, B, C, D])
      assert(p._ggb_type == "quadrilateral")
      p.line_thickness = 8
      p.color = "red"
      print("area =", p.area)
    `,
    expOutputs: ["area = 18.0"], // Pick's theorem
  },
  {
    label: "Polygon(Point, Point, Integer)",
    code: `
      A = Point(-2, -2)
      B = Point(0, -2)
      p = Polygon(A, B, 6, color="red", opacity=0.75)
      assert(p._ggb_type == "polygon")
      print("opacity =", p.opacity)
    `,
    expOutputs: ["opacity = 0.75"],
  },
];
