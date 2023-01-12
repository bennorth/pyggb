"""
Line through two points

Define two points, and construct the line joining them.
"""

P1 = Point(1, 2)
P2 = Point(3, 4)
line = Line(P1, P2)

print(str(P1) + " is a line through " + str(P1) + " and " + str(P2))
