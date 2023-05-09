"""
Exponential growth

See how quickly a number grows if you keep doubling it.
"""

from math import *

number = 1

while True:
    print(number)
    number = number * 2
    if number >= 10000:
        break
