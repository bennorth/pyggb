.. _python-and-geogebra-numbers:

Python and GeoGebra numbers
===========================

A :py:class:`Number` is a dynamic value which can be used in
calculations and, e.g., as an *x* or *y* coordinate of a geometric
object.  If the Number's value changes, any geometric objects
depending on that Number will update.

The current numeric value (as a Python :py:type:`float`) of a
:py:class:`Number` can be get or set via its :py:attr:`~Number.value`
property.


Example
-------

.. code-block:: python

   import time

   x = Number(-3.0)

   p_static = Point(x.value, 1.0)
   p_dynamic = Point(x, 2.0)

   for _ in range(600):
       x.value += 0.01
       time.sleep(0)

Running this code will show

:code:`p_static`
   a stationary point at (-3, 1), and

:code:`p_dynamic`
   a point which moves smoothly from (-3, 2) to (3, 2).

GeoGeobra also shows the two points differently, because the one
referred to by :code:`p_static` is *independent* whereas the one
referred to by :code:`p_dynamic` is not.


Calculations with :py:class:`Number`\ s
---------------------------------------

If you use a :py:class:`Number` in a calculation, the result is
another :py:class:`Number`.  This works in a similar way to a
spreadsheet formula which refers to another cell — when a cell's value
changes, all dependent cells update.

Example
~~~~~~~

.. code-block:: python

   import time

   x = Number(-3.0)
   x2 = 2.0 * x

   p1 = Point(x, 1.0)
   p2 = Point(x2, 2.0)
   k1 = Line(p1, p2)

   for _ in range(600):
       x.value += 0.01
       time.sleep(0)
