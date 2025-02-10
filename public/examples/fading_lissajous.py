"""
Animated Lissajous figure

The parameters are controlled by sliders, including a fade effect.
"""

import math
import time

# "Frequency" (up to a scale) of the horizontal
# oscillation.
omega_x = Slider(0.5, 2.0, increment=0.01)
omega_x.value = 1.0
omega_x.caption = "horizontal"

# "Frequency" (up to a scale) of the vertical
# oscillation.
omega_y = Slider(0.5, 2.0, increment=0.01)
omega_y.value = 1.25
omega_y.caption = "vertical"

# How quickly the fade effect happens.
fade_gamma = Slider(0.0, 1.0, increment=0.1)
fade_gamma.value = 0.3
fade_gamma.caption = "fade"

# How many segments to create.
n_segments = 240

# Collect the segments into a list.  We also collect
# the pairs of points making up the segments.  We need
# the points so we can move them.  We need the segments
# so we can change their colour.
point_pairs = []
segments = []
for i in range(n_segments):
    # Put all the points at the original.  We will
    # move them to proper locations in the final loop
    # below.
    p0 = Point(0, 0, is_visible=False)
    p1 = Point(0, 0, is_visible=False)
    point_pairs.append((p0, p1))
    segments.append(Segment(p0, p1))

# Index into the `point_pairs` list of the pair of points
# defining the oldest segment, which is the one we will move.
segment_idx = 0

# The current tip of the moving line.
x0 = 0
y0 = 0

# The driving parameter of the curve
th = 0.0
while True:
    # Find the new tip:
    x1 = math.sin(omega_x.value * th)
    y1 = math.sin(omega_y.value * th)
    th += 0.05

    # Move the oldest Segment to its new place, by updating
    # the coordinates of its Points.
    point_pairs[segment_idx][0].x = x0
    point_pairs[segment_idx][0].y = y0
    point_pairs[segment_idx][1].x = x1
    point_pairs[segment_idx][1].y = y1

    # Update the tip.
    x0, y0 = x1, y1
    
    # Now the next segment is the oldest one.
    segment_idx += 1
    segment_idx %= n_segments

    # Update every Segment's colour based on its age.
    for idx_offset in range(n_segments):
        # Wrap round the indexing.
        idx = (segment_idx + idx_offset) % n_segments
        
        # Compute the intensity based on the age.
        grey_01 = math.pow(idx_offset / n_segments, fade_gamma.value)
        grey = 255 - int(255 * grey_01)

        # Turn that into a #RRGGBB string.
        grey_hex = f"{grey:02x}"
        rgb_hex = f"#{grey_hex}{grey_hex}{grey_hex}"
        segments[idx].color = rgb_hex

    # Ensure we don't freeze!
    time.sleep(0)
