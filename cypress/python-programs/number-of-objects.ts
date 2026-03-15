export const specs = [
  {
    label: "NumberOfObjects()",
    code: `
      p = Point(3, 4)
      print(f"got {NumberOfObjects()} objects")
    `,
    // Create a Ggb "number" for each of x and y coord, and also a Ggb
    // "point" for the actual point.
    expOutputs: ["got 3 objects"],
  },
];
