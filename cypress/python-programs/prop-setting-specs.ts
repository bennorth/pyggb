const propSettingSpecsLUT = new Map<string, any>(
  [
    {
      attrName: "opacity",
      setValue: "0.75",
      expValue: "0.75",
    },
    {
      attrName: "line_thickness",
      setValue: "9",
      expValue: "9",
    },
    {
      attrName: "line_style",
      setValue: "2",
      expValue: "2",
    },
    {
      attrName: "color",
      setValue: '"red"',
      expValue: "#FF0000",
    },
    {
      attrName: "caption",
      setValue: '"TURN"',
      expValue: "TURN",
    },
    {
      attrName: "label_visible",
      setValue: "True",
      expValue: "True",
    },
  ].map((obj) => [obj.attrName, obj])
);

export const propSettingSpecsFromNames = (names: Array<string>) =>
  names.map((name) => propSettingSpecsLUT.get(name));
