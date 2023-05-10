"""
Draw the Mandelbrot set, a fractal based on complex numbers

Repeatedly performing a simple calculation on a complex number gives a
beautiful and intricate shape.  By generating a grid points of different
colours, we can draw a view of it.

_Based on a demonstration by Zoltan Kovacs._
"""

# Depending on the size of your screen, you might need to adjust the
# size of the points and/or zoom the output GeoGebra display.

import time

startx = -2.0
endx = 1.0
starty = -1.5
endy = 1.5
n_points_per_axis = 31

maxiter = 30


def Mandelbrot_iter(x, y):
    it = 0
    z = complex(0, 0)
    c = complex(x, y)
    while abs(z) < 2 and it < maxiter:
        z = z * z + c
        it += 1
    return it


xstep = (endx - startx) / (n_points_per_axis - 1)
ystep = (endy - starty) / (n_points_per_axis - 1)

for i in range(n_points_per_axis):
    x = startx + i * xstep
    print(f"Plotting for x = {x:.03f}")
    for j in range(n_points_per_axis):
        y = starty + j * ystep
        it = Mandelbrot_iter(x, y)
        col = it / maxiter
        P = Point(x, y, size=9, color=[col, col, col])
        time.sleep(0)
