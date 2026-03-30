Intersect function
==================

.. py:function:: Intersect(obj1, obj2, n)

   Find all intersections, as of the time of executing the function,
   of *obj1* and *obj2*.  If at least one object later changes (for
   example, by dragging a slider), such that more intersection points
   come into existence, those new points are inaccessible.  If, on the
   other hand, intersections points disappear, the ``Point`` object
   still exists but has ``NaN`` coordinates.

   The result is returned as a list, even if there is only one
   intersection point.  You can use Python's destructuring assignment
   if you know that, for example, there are exactly two intersection
   points:

   .. code-block:: python

      k1 = Circle(1, 0, 2)
      k2 = Circle(-1, 0, 2)
      p1, p2 = Intersect(k1, k2)


.. py:function:: Intersect(obj1, obj2, n)
   :noindex:

   Find the *n*\ th intersection between the given *obj1* and the
   given *obj2*.  The index *n* is one-based.

   .. caution::

      Although *n* is interpreted as a one-based index, values smaller
      than 1 are mapped to 1.  Values for *n* larger than the number
      of intersections between *obj1* and *obj2* produce a
      :py:class:`Point` both of whose coordinates are *NaN*.


.. seealso::

   `GeoGebra Intersect() reference
   <https://geogebra.github.io/docs/manual/en/commands/Intersect/>`_
