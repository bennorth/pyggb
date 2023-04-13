"""
Simulate elastic string art

Draw a simulation of art patterns made by connecting rows of nails with
string, with the bonus of being able to move the corner nails around as
the art is being made.

_Based on a demonstration by Zoltan Kovacs._
"""

import time

print("Drag the points around!")


half_side = 4.0
pt_size = 8

P = Point(half_side, half_side, size=pt_size)
Q = Point(half_side, -half_side, size=pt_size)
R = Point(-half_side, -half_side, size=pt_size)
S = Point(-half_side, half_side, size=pt_size)


def string_curve(P, Q, R, n):
    k1 = Segment(P, Q)
    k2 = Segment(Q, R)
    for i in range(n):
        t = i / (n - 1)
        p1 = Point(k1, t, is_visible=False)
        p2 = Point(k2, t, is_visible=False)
        Segment(p1, p2)
        time.sleep(0.1)


string_curve(P, Q, R, 20)
string_curve(Q, R, S, 20)
string_curve(R, S, P, 20)
string_curve(S, P, Q, 20)
