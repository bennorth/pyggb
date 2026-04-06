"""
Animated string art square

Draw a square of string art, which rotates and changes in size.
"""

import time
import math

# Rotation per corner.
HALF_PI = 0.5 * math.pi

# Create GeoGebra "Number" for the half-side of the square.  We
# can use this as if it were a Python number in things like
# Point().  But creating a Point using a Number makes a dynamic
# connection between the Point and the Number, as opposed to
# using a Python variable, where the value is fixed when the
# Point is created.
size = Number(3)

# Similarly for the angle of rotation.
theta = Number(0)

# Make points which are rotations of four corners of the square.
# These points will move if we update the `value` of the Numbers
# `size` and `theta`.
p1 = Rotate(Point(-size, -size, is_visible=False), theta)
p2 = Rotate(Point(size, -size, is_visible=False), theta)
p3 = Rotate(Point(size, size, is_visible=False), theta)
p4 = Rotate(Point(-size, size, is_visible=False), theta)

# Join those points up to make a square.
k1 = Segment(p1, p2)
k2 = Segment(p2, p3)
k3 = Segment(p3, p4)
k4 = Segment(p4, p1)

# Draw the strings.  We draw each loop of four strings as a
# Polygon with fully-transparent interior.
for i in range(20):
    t = i / 20
    vertices = [
        Point(k1, t, is_visible=False),
        Point(k2, t, is_visible=False),
        Point(k3, t, is_visible=False),
        Point(k4, t, is_visible=False),
    ]
    Polygon(
        vertices,
        opacity=0,
        color="blue",
        line_thickness=2
    )

# Report every quarter-turn.
last_reported_cycle = 0;

# Now when we change the "value" of the two Numbers (`size` and
# `theta`), the whole construction will update.
size_oscillation_theta = 0
while True:
    size.value = math.sin(size_oscillation_theta) + 2
    size_oscillation_theta += 0.005
    theta.value += 0.0025

    # If we've completed a new quarter-turn, report it.
    cycle = int(theta.value / HALF_PI)
    if cycle > last_reported_cycle:
        print(f"{cycle} cycle{'s' if cycle > 1 else ''}")
        last_reported_cycle = cycle

    # Very important to sleep() otherwise the program will
    # freeze!  Sleeping for 0.0 counts.
    time.sleep(0.0)
