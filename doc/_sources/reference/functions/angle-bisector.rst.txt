AngleBisector function
======================

.. py:function:: AngleBisector(point1, point2, point3)

   Construct a new (non-independent) GeoGebra line which is the
   bisector of the angle formed by the the given *point1*, *point2*,
   and *point3*, with *point2* being the apex.

.. py:function:: AngleBisector(line1, line2)
   :noindex:

   Construct two new (non-independent) GeoGebra lines which are the
   two bisectors of the given *line1* and *line2*.  The return value
   is a two-element list of the two (wrapped) lines.  You can use
   Python's destructuring assignment to assign to two variables:

   .. code-block:: python

      k1 = Line(Point(1, 4), Point(-1, -4))
      k2 = Line(Point(4, -1), Point(-4, 1))
      k3, k4 = AngleBisector(k2, k1)

   (In the special case that both arguments are the same line, just
   that same line is returned, in a one-element list.)


.. seealso::

   `GeoGebra AngleBisector() reference
   <https://geogebra.github.io/docs/manual/en/commands/AngleBisector/>`_
