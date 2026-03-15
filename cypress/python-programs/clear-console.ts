export const specs = [
  {
    label: "ClearConsole",
    code: `
      print("hello world")
      ClearConsole()
      print("that's all folks")
    `,
    expOutputs: ["that's all folks"],
    expNonOutputs: ["hello world"],
  },
];
