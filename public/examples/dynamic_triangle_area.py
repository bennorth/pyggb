"""
Calculate area as a triangle's vertices are dragged

**Does not work yet; needs `Distance`.**

Write a Python function which is called when a GeoGebra point is dragged
around the plane.
"""

import math

a = Point(3, 4)
b = Point(0, 2)
c = Point(5, 1)

k1 = Line(a, b)
k2 = Line(b, c)
k3 = Line(c, a)

print("Drag the points to see the area change")


@a.when_moved
@b.when_moved
@c.when_moved
def find_area():
    ab = Distance(a, b)
    bc = Distance(b, c)
    ca = Distance(c, a)
    s = 0.5 * (ab + bc + ca)
    A = math.sqrt(s * (s - ab) * (s - bc) * (s - ca))
    print(f"Area = {A:.2f}")


find_area()
