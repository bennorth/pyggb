export const specs = [
  {
    label: "Circumference(circle)",
    code: `
      p1 = Point(4, 1)
      k = Circle(p1, 2.0)
      print("Circumference %.4f" % Circumference(k).value)
    `,
    expOutputs: ["Circumference 12.5664"],
  },
  {
    label: "Circumference(ellipse)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, 0)
      p3 = Point(2, 3)
      k = Ellipse(p1, p2, p3)
      Circumference(k)  # Ignore
    `,
  },
];
