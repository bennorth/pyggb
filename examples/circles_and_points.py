"""
Draw some circles and some points

This example shows how you can draw *circles* and *points* using the
`Circle` and `Point` functions.
"""

# Draw concentric circles:
for x in range(6):
    Circle(0, 0, x)

# Draw a grid of points:
for x in range(5):
    for y in range(5):
        Point(x, y)

# Draw concentric circles:
for x in range(6):
    Circle(Point(1, 1), x)
