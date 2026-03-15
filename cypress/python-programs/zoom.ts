export const specs = [
  {
    label: "ZoomIn()",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      ZoomIn()
    `,
  },
  {
    label: "ZoomIn(scale-python-number)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      ZoomIn(1.5)
    `,
  },
  {
    label: "ZoomIn(scale-ggb-number)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      a = Number(1.5)
      ZoomIn(a)
    `,
  },
  {
    label: "ZoomIn(scale-centre-point)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      ZoomIn(1.25, z)
    `,
  },
  {
    label: "ZoomIn(scale-centre-coords-tuple)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      ZoomIn(0.95, (1, 2))
    `,
  },
  {
    label: "ZoomIn(scale-centre-coords-list)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      ZoomIn(2.5, [1, 2])
    `,
  },
  {
    label: "ZoomIn(bounding-box-mixed-py-ggb-numbers)",
    code: `
      k = Circle(2, 1, 2)
      z = Point(1, 2)
      a = Number(2.5)
      b = Number(3.75)
      ZoomIn(-1, 1, a, b)
    `,
  },
];
