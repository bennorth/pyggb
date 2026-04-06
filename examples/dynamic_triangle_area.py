"""
Calculate area as a triangle's vertices are dragged

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

d_ab = Distance(a, b)
d_bc = Distance(b, c)
d_ca = Distance(c, a)

@a.when_moved
@b.when_moved
@c.when_moved
def find_area():
    ab = d_ab.value
    bc = d_bc.value
    ca = d_ca.value
    s = 0.5 * (ab + bc + ca)
    A = math.sqrt(s * (s - ab) * (s - bc) * (s - ca))
    print(f"Area = {A:.2f}")


find_area()
