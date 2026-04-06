AreCollinear function
=====================

.. py:function:: AreCollinear(point1, point2, point3)

   Construct a new (non-independent) GeoGebra boolean which is true or
   false according to whether the three given points are collinear.

   If you want a snapshot of the value of this GeoGebra boolean as a
   Python ``boolean``, use code like the following:

   .. code-block:: python

      b = AreCollinear(p1, p2, p3)
      print(b.value)
      # True / False


.. seealso::

   `GeoGebra AreCollinear() reference
   <https://geogebra.github.io/docs/manual/en/commands/AreCollinear/>`_
