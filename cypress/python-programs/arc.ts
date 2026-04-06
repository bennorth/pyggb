import { propSettingSpecsFromNames } from "./prop-setting-specs";

const propSettingSpecs = propSettingSpecsFromNames([
  "opacity",
  "line_thickness",
  "line_style",
  "color",
  "caption",
]).map((protoSpec) => ({
  label: `Arc setting ${protoSpec.attrName}`,
  code: `
    k1 = Circle(0, 0, 3)
    a1 = Arc(k1, 0.5, 1.5, ${protoSpec.attrName}=${protoSpec.setValue})
    print("attr", a1.${protoSpec.attrName})
  `,
  expOutputs: [`attr ${protoSpec.expValue}`],
}));

export const specs = [
  {
    label: "Arc(ellipse, point, point)",
    code: `
      k1 = Circle(0, 0, 3)
      p1 = Point(4, 4)
      p2 = Point(1, 4)
      a1 = Arc(k1, p1, p2)
    `,
  },
  {
    label: "Arc(ellipse, number, number)",
    code: `
      k1 = Circle(0, 0, 3)
      n1 = Number(0.5)
      a1 = Arc(k1, n1, 1.0)
    `,
  },
  {
    label: "Arc free-copy",
    code: `
      k1 = Circle(0, 0, 3)
      n1 = Number(0.5)
      a1 = Arc(k1, n1, 1.0)
      a2 = a1.free_copy()
      print("free_copy() gave", a2._ggb_type)
    `,
    expOutputs: ["free_copy() gave arc"],
  },
  {
    label: "Arc.line_style",
    code: `
      k1 = Circle(0, 0, 3)
      n1 = Number(0.5)
      a1 = Arc(k1, n1, 1.0)
      a1.line_style = 2
      assert(a1.line_style == 2)
    `,
  },
  {
    label: "Arc.latex",
    code: `
      k1 = Circle(0, 0, 3)
      n1 = Number(0.5)
      print(Arc(k1, n1, 1.0).latex)
    `,
    expOutputs: ["1.5"], // Arc-length
  },
  ...propSettingSpecs,
];
