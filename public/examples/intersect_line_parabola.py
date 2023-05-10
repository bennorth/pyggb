"""
Intersect a line and a parabola

Create a parabola which can be adjusted using a slider, and find its
intersection with a fixed line.
"""

coeff_b = Slider(1, 5, increment=0.1)
parabola = Parabola(1.5, coeff_b, 0)
line = Line(1, 0)

print(parabola)
print(line)

coeff_b.value = 4.0
print("Intersections are:")
print("1:", Intersect(parabola, line, 1))
print("2:", Intersect(parabola, line, 2))
