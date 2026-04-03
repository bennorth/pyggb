import { zRunsWithoutErrorSpecArr } from "./python-program-spec";
import {
  createNewPyGgbFile,
  deIndent,
  optsNoIsolation,
  runCode,
} from "./shared";

// TODO (see also note at end):
class ConstructionVerificationState {
  // List of things we expect to see, in an order which lets us refer back to
  // points when describing lines, say.
}

const getPythonPrograms = async () => {
  // Limitation of TypeScript and/or bundler and/or other moving parts
  // mean we can't just list the basenames and map import() over them.
  const specModules = await Promise.all([
    import("../python-programs/angle-bisector"),
    import("../python-programs/angle"),
    import("../python-programs/arc"),
    import("../python-programs/area"),
    import("../python-programs/boolean"),
    import("../python-programs/centroid"),
    import("../python-programs/circle"),
    import("../python-programs/circumference"),
    import("../python-programs/clear-console"),
    import("../python-programs/distance"),
    import("../python-programs/ellipse"),
    import("../python-programs/eval-command"),
    import("../python-programs/function"),
    import("../python-programs/function-graph"),
    import("../python-programs/incircle"),
    import("../python-programs/intersect"),
    import("../python-programs/line"),
    import("../python-programs/list"),
    import("../python-programs/midpoint"),
    import("../python-programs/number-of-objects"),
    import("../python-programs/number"),
    import("../python-programs/parabola"),
    import("../python-programs/perimeter"),
    import("../python-programs/perpendicular-bisector"),
    import("../python-programs/perpendicular-line"),
    import("../python-programs/point"),
    import("../python-programs/polygon"),
    import("../python-programs/predicates"),
    import("../python-programs/properties"),
    import("../python-programs/rotate"),
    import("../python-programs/segment"),
    import("../python-programs/slider"),
    import("../python-programs/tangent"),
    import("../python-programs/triangle-center"),
    import("../python-programs/vector"),
    import("../python-programs/zoom"),
  ]);

  return specModules.flatMap((module) =>
    zRunsWithoutErrorSpecArr.parse(module.specs)
  );
};

getPythonPrograms().then((runsWithoutErrorSpecs) =>
  // We specify no test isolation here, to avoid the heavy start-up cost
  // per small program we run.  We just keep entering new programs into
  // the same pyggb "file".
  //
  describe("Runs valid Python programs", optsNoIsolation, () => {
    before(() => createNewPyGgbFile());

    runsWithoutErrorSpecs.forEach((spec, specIdx) => {
      const specFun = (spec.only ?? false) ? it.only : it;
      specFun(`runs ${spec.label} ok`, () => {
        cy.window().then((window) => {
          const fullCode = deIndent(spec.code) + '\nprint("done")';
          window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(fullCode);
          if (specIdx % 2 === 0) {
            runCode();
          } else {
            cy.get("#pyggb-ace-editor > textarea").type("{ctrl}{enter}", {
              force: true,
            });
          }
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
  })
);

type CodeWithErrorSpec = {
  label: string;
  code: string;
  assertions: Array<() => void>;
};

const runBadCode = (spec: CodeWithErrorSpec) => () => {
  cy.window().then((window) => {
    const code = deIndent(spec.code);
    window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(code);
    runCode();
    spec.assertions.forEach((assertion) => assertion());
  });
};

describe("Handles bad constructor calls", optsNoIsolation, () => {
  before(() => createNewPyGgbFile());

  const assertTypeError = (clsName: string) => () => {
    // Allow both of the following:
    //   "Thing() arguments must be ..."
    //   "Thing() argument must be..."
    const regexp = new RegExp(
      `^TypeError: ${clsName}\\(\\) arguments? must be`
    );
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
    badNoArgsSpec("Angle"),
    badNoArgsSpec("Arc"),
    badOneArgSpec("Arc"),
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
    simpleBadArgsSpec('Angle("one")'),
    simpleBadArgsSpec('Arc("one", "two", "three")'),
    simpleBadArgsSpec('Line("hello", 3)'),
    simpleBadArgsSpec("Line(Point(3, 4), 3)"),
    simpleBadArgsSpec("List([3, 4, 5])"),
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
    {
      label: "Angle(line, vector)",
      code: `
        k1 = Line(Point(-2, 0), Point(0, 2))
        v1 = Vector(1, 0)
        Angle(k1, v1)
      `,
      assertions: [assertTypeError("Angle")],
    },
  ];

  specs.forEach((spec) => it(`handles ${spec.label} ok`, runBadCode(spec)));
});

const assertErrorOfKindFun =
  (errorKindRe: RegExp) => (messageFragment: string) => () => {
    cy.get(".ErrorReport .message")
      .contains(errorKindRe)
      .contains(messageFragment);
  };

const assertValueError = assertErrorOfKindFun(/^ValueError:/);
const assertTypeError = assertErrorOfKindFun(/^TypeError:/);
const assertIndexError = assertErrorOfKindFun(/^IndexError:/);

describe("Handles bad function calls", optsNoIsolation, () => {
  before(() => createNewPyGgbFile());

  const specs: Array<CodeWithErrorSpec> = [
    {
      label: "TriangleCenter(): bad kind",
      code: `
        A = Point(1, 1)
        B = Point(1, 2)
        C = Point(2, 1)
        TriangleCenter(A, B, C, "no-such-center")
      `,
      assertions: [assertTypeError("center-kind is one of")],
    },
    {
      label: "List: bad indexing",
      code: `
        pts = List(Point(x, x) for x in range(4))
        pts[4]
      `,
      assertions: [assertIndexError("List object index")],
    },
    {
      label: "FunctionGraph(): bad expr",
      code: `
        f = FunctionGraph("x+*")
      `,
      assertions: [assertValueError("bad syntax of expr")],
    },
  ];

  specs.forEach((spec) => it(`handles ${spec.label} ok`, runBadCode(spec)));
});

describe("handles attempt to set bad attribute value", optsNoIsolation, () => {
  before(() => createNewPyGgbFile());

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
