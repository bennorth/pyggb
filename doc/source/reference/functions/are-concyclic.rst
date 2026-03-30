AreConcyclic function
=====================

.. py:function:: AreConcyclic(point1, point2, point3, point4)

   Construct a new (non-independent) GeoGebra boolean which is true or
   false according to whether the four given points are concyclic

   If you want a snapshot of the value of this GeoGebra boolean as a
   Python ``boolean``, use code like the following:

   .. code-block:: python

      b = AreConcyclic(p1, p2, p3, p4)
      print(b.value)
      # True / False


.. seealso::

   `GeoGebra AreConcyclic() reference
   <https://geogebra.github.io/docs/manual/en/commands/AreConcyclic/>`_
