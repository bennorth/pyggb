export const specs = [
  {
    label: "EvalCommand()",
    code: `
      A = Point(1, 1)
      B = Point(7, 2)
      s = EvalCommand(f"Line({A._ggb_label}, {B._ggb_label})")
      print("s is a", s._ggb_type)
    `,
    expOutputs: ["s is a line"],
  },
  {
    label: "EvalCommandMultiple()",
    code: `
      k1 = Circle(4, 2, 2)
      k2 = Circle(-3, 1, 3)
      ts = EvalCommandMultiple(f"Tangent({k1._ggb_label}, {k2._ggb_label})")
      print("got", len(ts), "objects")
      print(" ".join([t._ggb_type for t in ts]))
    `,
    expOutputs: ["got 4 objects", "line line line line"],
  },
];
