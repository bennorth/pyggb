import { newPolygonSpecs } from "./polygon-specs";

const conicSpecs = [
  {
    label: "Perimeter(circle)",
    code: `
      p1 = Point(4, 1)
      k = Circle(p1, 2.0)
      print("Perimeter %.4f" % Perimeter(k).value)
    `,
    expOutputs: ["Perimeter 12.5664"],
  },
  {
    label: "Perimeter(ellipse)",
    code: `
      p1 = Point(4, 1)
      p2 = Point(-1, 0)
      p3 = Point(2, 3)
      k = Ellipse(p1, p2, p3)
      Perimeter(k)  # Ignore
    `,
  },
];

function polygonPerimeter(points: Array<Array<number>>): number {
  const nPoints = points.length;
  let perimeter = 0.0;
  for (let i = 0; i < nPoints; ++i) {
    const p0 = points[i];
    const p1 = points[(i + 1) % nPoints];
    perimeter += Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  }
  return perimeter;
}

const polygonSpecs = newPolygonSpecs("Perimeter", polygonPerimeter);

export const specs = [...conicSpecs, ...polygonSpecs];
