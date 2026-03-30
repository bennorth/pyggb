Area function
=============

.. py:function:: Area(obj)

   Construct a new (non-independent) dynamic GeoGebra number which is
   the area of the given *obj*, which must be an ellipse (which might
   be a circle), or a polygon.

   If you want a snapshot of the area as a Python ``float``,
   you can use code like the following:

   .. code-block:: python

      k = Circle(3, 4, 2)
      print(Area(k).value)
      # 12.56⋯

.. py:function:: Area(point1, point2, point3, ..., pointN)
   :noindex:

   Construct a new (non-independent) dynamic GeoGebra number which is
   the area of the polygon defined by the given sequence of points, of
   which there must be at least three.  See previous variant for an
   example of how to get a snapshot of this value as a Python
   ``float``.


.. seealso::

   `GeoGebra Area() reference
   <https://geogebra.github.io/docs/manual/en/commands/Area/>`_
