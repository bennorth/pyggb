"""
Juggling animation

Create a stick figure juggling five balls, where everything moves based
on one `Number`.
"""

import time
import math

head_0 = Point(0, 2, is_visible=False)
head_radius = 0.8
head = Circle(head_0, head_radius, line_thickness=9)

head_base = Point(head_0.x, head_0.y - head_radius, is_visible=False)

spine_base = Point(0, head_0.y - 4, is_visible=False)
torso = Segment(head_base, spine_base, line_thickness=9)

# "Left" and "right" are from the juggler's point of view:
shoulder_y = head_0.y - 1.5
l_shoulder = Point(1.25, shoulder_y, color="#333", size=4)
r_shoulder = Point(-1.25, shoulder_y, color="#333", size=4)

shoulders = Segment(l_shoulder, r_shoulder, line_thickness=9)
up_arm_0 = Vector(0.0, -1.0, is_visible=False)

n_balls = 5  # Adjustable, but has to be odd and >= 3!
ph = Number(0.0)

l_arm_ph = (n_balls * ph) % 1.0
l_arm_th = 2.0 * math.pi * l_arm_ph

l_up_th = -0.25 * l_arm_ph * Function.sin(l_arm_th)
v_l_up_arm = Rotate(up_arm_0, l_up_th).with_properties(is_visible=False)
l_elbow = l_shoulder + v_l_up_arm

l_forearm_x = -0.75 * Function.cos(l_arm_th)
l_forearm_y = 0.5 * (Function.sin(l_arm_th) - 0.8)

v_l_forearm = Vector(l_forearm_x, l_forearm_y, is_visible=False)
l_hand = l_elbow + v_l_forearm

l_up_arm = Segment(l_shoulder, l_elbow, line_thickness=9)
l_forearm = Segment(l_elbow, l_hand, line_thickness=9)

r_arm_ph = (l_arm_ph + 0.5) % 1.0
r_arm_th = 2.0 * math.pi * r_arm_ph

r_up_th = 0.25 * r_arm_ph * Function.sin(r_arm_th)
v_r_up_arm = Rotate(up_arm_0, r_up_th).with_properties(is_visible=False)
r_elbow = r_shoulder + v_r_up_arm

r_forearm_x = 0.75 * Function.cos(r_arm_th)
r_forearm_y = 0.5 * (Function.sin(r_arm_th) - 0.8)

v_r_forearm = Vector(r_forearm_x, r_forearm_y, is_visible=False)
r_hand = r_elbow + v_r_forearm

r_up_arm = Segment(r_shoulder, r_elbow, line_thickness=9)
r_forearm = Segment(r_elbow, r_hand, line_thickness=9)

ball_colors = ["#f44", "#4f4", "#44f", "#ff2", "#2ff"]


def mk_ball(i):
    ball_ph = (2.0 * (ph * n_balls + i)) % (n_balls * 2)
    air_ph = (ball_ph % n_balls) / (n_balls - 1)
    air_l_to_r_x = 0.5 - air_ph * 2.5
    air_r_to_l_x = -0.5 + air_ph * 2.5
    air_y = head_0.y + 1.0 - 15.0 * (air_ph - 0.5) * (air_ph - 0.5)
    air_l_to_r = Point(air_l_to_r_x, air_y, is_visible=False)
    air_r_to_l = Point(air_r_to_l_x, air_y, is_visible=False)
    loc = If(
        Function.compare_LT(ball_ph, Number(n_balls - 1)),
        air_l_to_r,
        Function.compare_LT(ball_ph, Number(n_balls)),
        r_hand,
        Function.compare_LT(ball_ph, Number(2 * n_balls - 1)),
        air_r_to_l,
        l_hand,
    )
    color = ball_colors[i % 5]
    return Point(loc.x_number, loc.y_number, color=color, size=9)


balls = [mk_ball(i) for i in range(n_balls)]

while True:
    ph.value += 0.0075
    time.sleep(1 / 60)
