Intersect function
==================

.. py:function:: Intersect(obj1, obj2, n)

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
