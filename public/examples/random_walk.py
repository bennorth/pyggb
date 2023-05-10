"""
Simulate a random walk

Use random numbers to simulate a two-dimensional random walk.

_Based on a demonstration by Zoltan Kovacs._
"""

import time
import random

n_walks = 20
n_steps = 100

for j in range(n_walks):
    x = 0
    y = 0
    P = Point(x, y)
    for i in range(n_steps):
        w = random.randint(1, 4)
        if w == 1:
            x += 1
        elif w == 2:
            x -= 1
        elif w == 3:
            y += 1
        elif w == 4:
            y -= 1
        P.is_visible = False
        Q = Point(x, y)
        Segment(P, Q)
        P = Q
        time.sleep(0.01)
