"""
Intersect a line and a parabola

**Does not work yet**

Create a parabola which can be adjusted using a slider, and find its
intersection with a fixed line.
"""

num = Slider(1, 5, increment=0.1)
parabola = evalCommand("y=" + num + " x^2")
line = evalCommand("y = x")

print(parabola)
print(line)

intersect(parabola, line)

## TODO: Would "num.value = 2.0" be more Pythonic?
setValue(num, 2)
