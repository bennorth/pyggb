import { createNewPyGgbFile, optsNoIsolation } from "./shared";

describe("runs provided examples", optsNoIsolation, () => {
  before(createNewPyGgbFile);

  // Some examples run forever, or at least for longer than we want to
  // wait.  Once we've seen the output we expect, stop them.  The
  // "force" is because when an example does run to completion, the STOP
  // button is disabled so Cypress is reluctant to click it.
  afterEach(() => {
    cy.get("button").contains("STOP").click({ force: true });
  });

  type SampleCodeSpec = {
    filename: string;
    skip?: boolean;
    expDoneOutput?: boolean;
    expOutputs?: Array<string>;
  };

  const specs: Array<SampleCodeSpec> = [
    // TODO
    {
      filename: "circles_and_points.py",
    },
    {
      filename: "draw_slowly.py",
    },
    {
      filename: "dynamic_triangle_area.py",
    },
    {
      filename: "exponential_growth.py",
    },
    {
      filename: "get_set_properties.py",
    },
    {
      filename: "intersect_line_parabola.py",
    },
    {
      filename: "juggling.py",
      expDoneOutput: false,
      expOutputs: ["Let's go!"],
    },
    {
      filename: "line_through_points.py",
    },
    {
      filename: "mandelbrot.py",
      expDoneOutput: false,
      expOutputs: ["Plotting for x = -1.500"],
    },
    {
      filename: "random_walk.py",
      expDoneOutput: false,
      expOutputs: ["Starting walk 2"],
    },
    {
      filename: "regression.py",
      skip: true,
    },
    {
      filename: "string_art.py",
    },
  ];

  specs.forEach((spec) => {
    it(`runs example "${spec.filename}"`, () => {
      if (spec.skip ?? false) {
        return;
      }

      cy.fixture(`examples/${spec.filename}`, "utf-8").then((code) => {
        cy.window().then((window) => {
          window["PYGGB_CYPRESS"]["ZERO_DELAY"] = true;
          const fullCode = code + '\n\nprint("done")';
          window["PYGGB_CYPRESS"].ACE_EDITOR.setValue(fullCode);
          cy.get("button").contains("RUN").click();
          if (spec.expDoneOutput ?? true) {
            cy.get(".stdout-inner").contains("done");
          }
          (spec.expOutputs ?? []).forEach((expOutput) =>
            cy.get(".stdout-inner").contains(`${expOutput}\n`)
          );
        });
      });
    });
  });
});
