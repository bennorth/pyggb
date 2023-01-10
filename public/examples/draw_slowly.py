"""
Draw concentric circles slowly

Use Python's `time` module to pause between drawing circles.
"""

import time

for x in range(1, 6):
    Circle(0, 0, x)
    # Pause for 1 second between circles
    time.sleep(1)
