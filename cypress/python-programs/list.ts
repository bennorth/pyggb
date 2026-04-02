export const specs = [
  {
    label: "List (construct empty)",
    code: `
      nothing = List()
    `,
  },
  {
    label: "List (from generator)",
    code: `
      pts_list = List(Point(x, x * x) for x in range(10))
    `,
  },
  {
    label: "List indexing",
    code: `
      pts_list = List([Point(x, x * x) for x in range(10)])
      print("eq?", AreEqual(pts_list[3], Point(3, 9)).value)
    `,
    expOutputs: ["eq? True"],
  },
];
