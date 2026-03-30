Perimeter function
==================

.. py:function:: Perimeter(obj)

   Construct a new (non-independent) dynamic GeoGebra number which is
   the perimeter of the given *obj*, which must be an ellipse (which
   might be a circle) or a polygon.

   If you want a snapshot of the perimeter as a Python ``float``,
   you can use code like the following:

   .. code-block:: python

      k = Circle(3, 4, 2)
      print(Perimeter(k).value)
      # 12.56⋯


.. seealso::

   `GeoGebra Perimeter() reference
   <https://geogebra.github.io/docs/manual/en/commands/Perimeter/>`_
