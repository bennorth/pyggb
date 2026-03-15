import { newPolygonSpecs } from "./polygon-specs";

const conicSpecs = [
  {
    label: "Area(circle)",
    code: `
      p1 = Point(4, 1)
      k = Circle(p1, 2.0)
      print("Area %.4f" % Area(k).value)
    `,
    expOutputs: ["Area 12.5664"],
  },
  {
    label: "Area(ellipse)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, 0)
      p3 = Point(2, 3)
      k = Ellipse(p1, p2, p3)
      Area(k)  # Ignore
    `,
  },
];

function polygonArea(points: Array<Array<number>>): number {
  // https://en.wikipedia.org/wiki/Shoelace_formula
  const nPoints = points.length;
  let twiceArea = 0.0;
  for (let i = 0; i < nPoints; ++i) {
    const p0 = points[i];
    const p1 = points[(i + 1) % nPoints];
    twiceArea += p0[0] * p1[1];
    twiceArea -= p0[1] * p1[0];
  }
  return 0.5 * twiceArea;
}

const polygonSpecs = newPolygonSpecs("Area", polygonArea);

export const specs = [...conicSpecs, ...polygonSpecs];
