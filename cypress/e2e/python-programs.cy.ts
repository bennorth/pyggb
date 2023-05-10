import { v4 as uuidv4 } from "uuid";
import { createNewPyGgbFile, optsNoIsolation } from "./shared";

class ConstructionVerificationState {
  // List of things we expect to see, in an order which lets us refer back to
  // points when describing lines, say.
}

const allSpaces = new RegExp("^ *$");
const initialSpaces = new RegExp("^ *");
const deIndent = (rawCode: string): string => {
  const allLines = rawCode.split("\n");

  if (allLines[0] !== "") {
    throw Error("need empty first line of code");
  }
  const nLines = allLines.length;
  if (!allSpaces.test(allLines[nLines - 1])) {
    throw Error("need all-spaces last line of code");
  }

  const lines = allLines.slice(1, nLines - 1);

  const nonBlankLines = lines.filter((line) => !allSpaces.test(line));
  const nonBlankIndents = nonBlankLines.map(
    (line) => initialSpaces.exec(line)[0].length
  );
  const minNonBlankIndent = Math.min(...nonBlankIndents);

  const strippedLines = lines.map((line) => line.substring(minNonBlankIndent));
  return strippedLines.join("\n") + "\n";
};

// We specify no test isolation here, to avoid the heavy start-up cost
// per small program we run.  We just keep entering new programs into
// the same pyggb "file".
//
describe("Runs valid Python programs", optsNoIsolation, () => {
  before(createNewPyGgbFile);

  type RunsWithoutErrorSpec = {
    label: string;
    code: string;
    expOutputs?: Array<string>;
    expNonOutputs?: Array<string>;
  };

  const runsWithoutErrorSpecs: Array<RunsWithoutErrorSpec> = [
    {
      label: "Get/set color as numeric triple",
      code: `
        A = Point(3, 4)
        A.color = (0.25, 0.5, 0.125)
        assert(A.color == "#408020")
        for exp_v, got_v in zip([64/255, 128/255, 32/255], A.color_floats):
          assert(abs(got_v - exp_v) < 1.0e-10)
        A.color = [0, 0.5, 1]
        assert(A.color == "#0080FF")
      `,
    },
    {
      label: "Line(Point, Point)",
      code: `
        A = Point(3, 4)
        B = Point(2, 1)
        k = Line(A, B)
        assert(k._ggb_type == "line")
        k.line_thickness = 8
        k.color = "blue"
      `,
    },
    {
      label: "Line(m, c)",
      code: `
        k = Line(0.5, 3, line_thickness=8)
        assert(k._ggb_type == "line")
      `,
    },
    {
      label: "Point(x, y, kwargs)",
      code: `
        A = Point(3, 4, color="#f00", size=8)
        assert(A._ggb_type == "point")
        B = Point(1, -5, is_visible=False)
        print(A.color)
      `,
      expOutputs: ["#FF0000"],
    },
    {
      label: "Point(line, param)",
      code: `
        A = Point(0, 0)
        B = Point(4, 4)
        k = Segment(A, B)
        C = Point(k, 0.25)
        assert(C.x == 1.0 and C.y == 1.0)
      `,
    },
    {
      label: "Point(object)",
      code: `
        A = Point(0, 0)
        B = Point(4, 4)
        k = Segment(A, B)
        C = Point(k)
        assert(C.x == C.y)
        assert(C.x >= 0.0)
        assert(C.x <= 4.0)
      `,
    },
    {
      label: "Number",
      code: `
        x = Number(3.25)
        assert(x._ggb_type == "numeric")
        print("x1 =", x.value)
        x.value = 4.5
        print("x2 =", x.value)
      `,
      expOutputs: ["x1 = 3.25", "x2 = 4.5"],
    },
    {
      label: "Boolean",
      code: `
        x = Boolean(True)
        assert(x._ggb_type == "boolean")
        print("x1 =", x.value)
        x.value = False
        print("x2 =", x.value)
      `,
      expOutputs: ["x1 = True", "x2 = False"],
    },
    {
      label: "Circle(Point, radius)",
      code: `
        A = Point(3, 4)
        k = Circle(A, 2)
        assert(k._ggb_type == "circle")
        l = Circle(A, Number(2))
        l.line_thickness = 8
        l.color = "red"
      `,
    },
    {
      label: "Circle(Point, Point)",
      code: `
        A = Point(3, 2)
        B = Point(6, 2)
        k = Circle(A, B)
        assert(k._ggb_type == "circle")
        print("radius =", k.radius)
      `,
      expOutputs: ["radius = 3.0"],
    },
    {
      label: "Circle(Point, Point, Point)",
      code: `
        A = Point(2, 0)
        B = Point(0, 2)
        C = Point(-2, 0)
        k = Circle(A, B, C)
        assert(k._ggb_type == "circle")
        print("radius =", k.radius)
      `,
      expOutputs: ["radius = 2.0"],
    },
    {
      label: "Circle(Number, Number, Number)",
      code: `
        k = Circle(1, Number(2), 3.5, opacity=0.875)
        assert(k._ggb_type == "circle")
        print("radius =", k.radius)
        print("opacity =", k.opacity)
      `,
      expOutputs: ["radius = 3.5", "opacity = 0.875"],
    },
    {
      label: "Ellipse(Point, Point, Number)",
      code: `
        A = Point(2, 0)
        B = Point(-2, 0)
        k1 = Ellipse(A, B, Number(4.0), color="red")
        k2 = Ellipse(A, B, 3.0, opacity=0.8)
        assert(k1._ggb_type == "ellipse")
        assert(k2._ggb_type == "ellipse")
      `,
    },
    {
      label: "Ellipse(Point, Point, Segment)",
      code: `
        A = Point(2, 0)
        B = Point(-2, 0)
        s = Segment(Point(0, 0), Point(3, 4))
        k1 = Ellipse(A, B, s)
        assert(k1._ggb_type == "ellipse")
      `,
    },
    {
      label: "Ellipse(Point, Point, Point)",
      code: `
        A = Point(2, 0)
        B = Point(-2, 0)
        C = Point(4, 1)
        k1 = Ellipse(A, B, C)
        assert(k1._ggb_type == "ellipse")
      `,
    },
    {
      label: "Vector(Point, Point)",
      code: `
        A = Point(3, 0)
        B = Point(0, 4)
        v1 = Vector(A, B)
        assert(v1._ggb_type == "vector")
        v1.line_thickness = 8
        v1.color = "red"
      `,
    },
    {
      label: "Vector(Number, Number)",
      code: `
        v1 = Vector(3, 4)
        assert(v1._ggb_type == "vector")
        v2 = Vector(2, Number(1))
        v3 = Vector(Number(4), -1)
        v4 = Vector(Number(3), Number(-2))
      `,
    },
    {
      label: "Segment(Point, Point)",
      code: `
        A = Point(3, 0)
        B = Point(0, 4)
        k = Segment(A, B, line_thickness=8)
        assert(k._ggb_type == "segment")
        print("length =", k.length)
        print("thickness =", k.line_thickness)
      `,
      expOutputs: ["length = 5.0", "thickness = 8"],
    },
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
    {
      label: "Parabola(Point, Line)",
      code: `
        A = Point(0, Number(-4))
        k = Line(Point(-1, -5), Point(1, -5))
        p = Parabola(A, k, color="red")
        assert(p._ggb_type == "parabola")
        p.line_thickness = 8
        p.color = "red"
      `,
    },
    {
      label: "Parabola(a, b, c)",
      code: `
        p = Parabola(2, 1, -2)
        assert(p._ggb_type == "parabola")
        A = Point(-0.25, -4)
        assert(Distance(A, p) == 1.875)
      `,
    },
    {
      label: "Distance(Point, Point)",
      code: `
        A = Point(-3, 0)
        B = Point(0, -4)
        print("AB =", Distance(A, B))
      `,
      expOutputs: ["AB = 5.0"],
    },
    {
      label: "Distance(Point, Line)",
      code: `
        A = Point(2, -2)
        B = Point(-4, 0)
        C = Point(0, 4)
        k = Line(B, C)
        d = Distance(A, k)
        print(f"Ak = {d:.4f}")
      `,
      expOutputs: ["Ak = 5.6569"], // 4√2
    },
    {
      label: "Distance(Point, Polygon)",
      code: `
        A = Point(2, -2)
        B = Point(-1, 2)
        C = Point(-0.5, 3)
        p = Polygon(B, C, 6)
        d = Distance(A, p)
        print("Ap =", d)
      `,
      expOutputs: ["Ap = 5.0"], // Nearest point is vertex B
    },
    {
      label: "Intersect(Line, Line)",
      code: `
        A = Point(0, 0)
        B = Point(2, 4)
        k1 = Line(A, B)
        C = Point(2, 1)
        D = Point(0, 3)
        k2 = Line(C, D)
        E = Intersect(k1, k2, 1)
        print(f"E = ({E.x}, {E.y})")
      `,
      expOutputs: ["E = (1.0, 2.0)"],
    },
    {
      label: "Intersect(Circle, Circle)",
      code: `
        from operator import attrgetter
        k1 = Circle(Point(3, 0), 5)
        k2 = Circle(Point(-3, 0), 5)
        rawEs = [Intersect(k1, k2, i) for i in [1, 2]]
        Es = sorted(rawEs, key=attrgetter("y"))
        print(len(Es), "intersection/s")
        print(f"Es[0] = ({Es[0].x}, {Es[0].y})")
        print(f"Es[1] = ({Es[1].x}, {Es[1].y})")
      `,
      expOutputs: [
        "2 intersection/s",
        "Es[0] = (0.0, -4.0)",
        "Es[1] = (0.0, 4.0)",
      ],
    },
    {
      label: "Intersect(Ellipse, Ellipse)",
      code: `
        import math

        A = Point(-2, 0)
        B = Point(2, 0)
        C = Point(0, -2)
        D = Point(0, 2)

        sma = 1.0 + math.sqrt(5.0)
        k1 = Ellipse(A, B, sma)
        k2 = Ellipse(C, D, sma)

        def print_4dp(p):
            print(f"({p.x:.04f}, {p.y:.04f})")

        print_4dp(Intersect(k1, k2, 1))
        print_4dp(Intersect(k1, k2, 2))
        print_4dp(Intersect(k1, k2, 3))
        print_4dp(Intersect(k1, k2, 4))
      `,
      expOutputs: [
        // Not necessarily in this order:
        "(2.0000, 2.0000)",
        "(2.0000, -2.0000)",
        "(-2.0000, 2.0000)",
        "(-2.0000, -2.0000)",
      ],
    },
    {
      label: "Rotate(Vector)",
      code: `
        import math
        A = Point(1, 3)
        v = Vector(2, 0)
        B = A + Rotate(v, math.pi / 4.0)
        print(f"B = ({B.x:.4f}, {B.y:.4f})")
      `,
      expOutputs: ["B = (2.4142, 4.4142)"],
    },
    {
      label: "Slider",
      code: `
        coeff_b = Slider(1, 5, increment=0.1)
        assert(coeff_b._ggb_type == "numeric")
        parabola = Parabola(1.5, coeff_b, 0)
        line = Line(1, 0)

        intersection = Intersect(parabola, line, 1)
        assert(intersection.x == 0.0)
        assert(intersection.y == 0.0)

        coeff_b.value = 4.0
        Es = [Intersect(parabola, line, i) for i in [1, 2]]
        assert(Es[0].x == 0.0)
        assert(Es[0].y == 0.0)
        assert(Es[1].x == -2.0)
        assert(Es[1].y == -2.0)
      `,
    },
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
    {
      label: "Function.sin/cos",
      code: `
        import math
        sin_pi_3 = Function.sin(Number(math.pi / 3.0)).value
        cos_pi_3 = Function.cos(Number(math.pi / 3.0)).value
        print(f"sin = {sin_pi_3:.4f}")
        print(f"cos = {cos_pi_3:.4f}")
      `,
      expOutputs: ["sin = 0.8660", "cos = 0.5000"],
    },
    {
      label: "Number ops",
      code: `
        x = Number(2.0)
        y = 4.0
        print((x + y).value == 6.0)
        print((y + x).value == 6.0)
        print((x - y).value == -2.0)
        print((y - x).value == 2.0)
        print((x * y).value == 8.0)
        print((y * x).value == 8.0)
        print((y / x).value == 2.0)
        print((x / y).value == 0.5)
      `,
      expNonOutputs: ["False"],
    },
    {
      label: "Point.free_copy()",
      code: `
        A = Point(3, 4)
        A1 = A.free_copy()
        assert(A1._ggb_type == "point")
        A.x = 4
        A1.x = 2
      `,
    },
    {
      label: "Circle.free_copy()",
      code: `
        k = Circle(3, 4, 5)
        k1 = k.free_copy()
        assert(k1._ggb_type == "circle")
      `,
    },
    {
      label: "Line.free_copy()",
      code: `
        A = Point(3, 4)
        B = Point(2, 1)
        k = Line(A, B)
        k1 = k.free_copy()
        assert(k1._ggb_type == "line")
      `,
    },
    {
      label: "Number.free_copy()",
      code: `
        A = Point(3, 4)
        B = Number(3.0)
        x1 = A.x_number + B
        x2 = x1.free_copy()
        assert(x2._ggb_type == "numeric")
      `,
    },
    {
      label: "Boolean.free_copy()",
      code: `
        A = Point(3, 4)
        p = Function.compare_LT(A.x_number, A.y_number)
        p1 = p.free_copy()
        assert(p1._ggb_type == "boolean")
      `,
    },
    {
      label: "Vector.free_copy()",
      code: `
        A = Point(3, 4)
        B = Point(1, 1)
        v = Vector(A, B)
        v1 = v.free_copy()
        assert(v1._ggb_type == "vector")
      `,
    },
    {
      label: "Segment.free_copy()",
      code: `
        A = Point(3, 4)
        B = Point(1, 1)
        s = Segment(A, B)
        s1 = s.free_copy()
        assert(s1._ggb_type == "segment")
      `,
    },
    {
      label: "Parabola.free_copy()",
      code: `
        A = Point(3, 4)
        B = Point(1, 1)
        C = Point(-1, 1)
        k = Line(B, C)
        c = Parabola(A, k)
        c1 = c.free_copy()
        assert(c1._ggb_type == "parabola")
      `,
    },
  ];

  runsWithoutErrorSpecs.forEach((spec) => {
    it(`runs ${spec.label} ok`, () => {
      cy.window().then((window) => {
        const fullCode = deIndent(spec.code) + '\nprint("done")';
        window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(fullCode);
        cy.get("button").contains("RUN").click();
        cy.get(".stdout-inner").contains("done");
        (spec.expOutputs ?? []).forEach((expOutput) =>
          cy.get(".stdout-inner").contains(`${expOutput}\n`)
        );
        (spec.expNonOutputs ?? []).forEach((expNonOutput) =>
          cy.get(".stdout-inner").contains(expNonOutput).should("not.exist")
        );
      });
    });
  });
});

type CodeWithErrorSpec = {
  label: string;
  code: string;
  assertions: Array<() => void>;
};

const runBadCode = (spec: CodeWithErrorSpec) => () => {
  cy.window().then((window) => {
    const code = deIndent(spec.code);
    window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(code);
    cy.get("button").contains("RUN").click();
    spec.assertions.forEach((assertion) => assertion());
  });
};

describe("Handles bad constructor calls", optsNoIsolation, () => {
  before(createNewPyGgbFile);

  const assertTypeError = (clsName: string) => () => {
    const regexp = new RegExp(`^TypeError: ${clsName}\\(\\) arguments must be`);
    cy.get(".ErrorReport .message").contains(regexp);
  };

  const assertValueError = (clsName: string, messageFragment: string) => () => {
    const regexp = new RegExp(`^ValueError: ${clsName}\\([^)]*\\):`);
    cy.get(".ErrorReport .message").contains(regexp).contains(messageFragment);
  };

  const simpleBadArgsSpec = (codeFragment: string): CodeWithErrorSpec => {
    const clsName = new RegExp("^([^()]*)\\(").exec(codeFragment)[1];
    return {
      label: `${codeFragment}`,
      code: `\n${codeFragment}\n`,
      assertions: [assertTypeError(clsName)],
    };
  };

  const badNoArgsSpec = (clsName: string): CodeWithErrorSpec =>
    simpleBadArgsSpec(`${clsName}()`);

  const badOneArgSpec = (clsName: string): CodeWithErrorSpec =>
    simpleBadArgsSpec(`${clsName}(lambda x: x)`);

  const specs: Array<CodeWithErrorSpec> = [
    badNoArgsSpec("Boolean"),
    badNoArgsSpec("Circle"),
    badOneArgSpec("Circle"),
    badNoArgsSpec("Ellipse"),
    badOneArgSpec("Ellipse"),
    badNoArgsSpec("Line"),
    badOneArgSpec("Line"),
    badNoArgsSpec("Number"),
    badOneArgSpec("Number"),
    badNoArgsSpec("Parabola"),
    badOneArgSpec("Parabola"),
    badNoArgsSpec("Point"),
    badOneArgSpec("Point"),
    badNoArgsSpec("Polygon"),
    badOneArgSpec("Polygon"),
    badNoArgsSpec("Segment"),
    badOneArgSpec("Segment"),
    badNoArgsSpec("Vector"),
    badOneArgSpec("Vector"),
    badNoArgsSpec("Intersect"),
    badOneArgSpec("Intersect"),
    simpleBadArgsSpec('Circle("hello", 3)'),
    simpleBadArgsSpec('Circle(Point(1, 2), "hello")'),
    simpleBadArgsSpec("Circle(Point(1, 2), 2, 3)"),
    simpleBadArgsSpec('Circle("one", "two", "three")'),
    simpleBadArgsSpec('Ellipse("one", "two", "three")'),
    simpleBadArgsSpec('Line("hello", 3)'),
    simpleBadArgsSpec("Line(Point(3, 4), 3)"),
    simpleBadArgsSpec("Parabola(Point(3, 4), 3)"),
    simpleBadArgsSpec('Parabola("hello", 3, 4)'),
    simpleBadArgsSpec('Point("hello", 33)'),
    simpleBadArgsSpec('Polygon("hello", 33, "world")'),
    simpleBadArgsSpec("Segment(Point(1, 2), 33)"),
    simpleBadArgsSpec("Slider(Point(1, 2), 33)"),
    simpleBadArgsSpec("Vector(Point(1, 2), 33)"),
    {
      label: "Point(Point, 3)",
      code: `
        A = Point(2, 3)
        Point(A, 0.5)
      `,
      assertions: [
        assertValueError("Point", 'could not find point along "point"'),
      ],
    },
  ];

  specs.forEach((spec) => it(`handles ${spec.label} ok`, runBadCode(spec)));
});

describe("handles attempt to set bad attribute value", optsNoIsolation, () => {
  before(createNewPyGgbFile);

  const assertValueError = (messageFragment: string) => () => {
    cy.get(".ErrorReport .message")
      .contains(/^ValueError:/)
      .contains(messageFragment);
  };

  const specs: Array<CodeWithErrorSpec> = [
    {
      label: "Point.color = [0.5, 0.5, 1.5]",
      code: `
        A = Point(1, 1)
        A.color = [0.5, 0.5, 1.5]
      `,
      assertions: [assertValueError("must be >=0.0 and <=1.0")],
    },
    {
      label: "Point.color = [0.5, 0.5]",
      code: `
        A = Point(1, 1)
        A.color = [0.5, 0.5]
      `,
      assertions: [assertValueError("must have three elements")],
    },
    {
      label: 'Point.color = [0.5, 0.5, "hello"]',
      code: `
        A = Point(1, 1)
        A.color = [0.5, 0.5, "hello"]
      `,
      assertions: [assertValueError("each element must be a number")],
    },
  ];

  specs.forEach((spec) => it(`handles ${spec.label} ok`, runBadCode(spec)));
});

/**
 * How to specify what should happen as the result of running a program under
 * test?  Want to say that certain points (with particular properties, such as
 * coords, colors, sizes) exist.  And that other things (line, segments) also
 * exist, to include certain of those points.
 *
 * Want to test all the construction facilities.
 *
 * ExpectPoint(x, y, props, labelToAssign)
 *
 * ExpectLine(pointLabel_1, pointLabel_2)  // Points can be in either order
 *
 * ExpectPolygon(list-of-points, props)  // Points can be cyclically permuted
 *
 * ExpectCircle(centre, radius)  // Can get at radius via Radius().
 *
 * Want to avoid duplicating code between skulpt-ggb.js and test code.  Might be
 * unable to avoid all duplication since here we don't want to worry about
 * Python objects.
 */
