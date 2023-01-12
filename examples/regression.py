"""
Linear and quadratic regression

**Does not work yet**

Create some points and find the line, and separately parabola, which
best fit the points.
"""

P1 = Point(1, 2)
P2 = Point(3, 4)
P3 = Point(1, 4)
P4 = Point(0, 4)
P5 = Point(2, 3)
P6 = Point(5, 3)

all_points = [P1, P2, P3, P4, P5, P6]

# Regression line
regressionLine = FitPoly(all_points, 1)

# Regression quadratic
regressionParabola = FitPoly(all_points, 2)

print("Now try dragging the points!")
