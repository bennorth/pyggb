AreConcurrent function
======================

.. py:function:: AreConcurrent(line1, line2, line3)

   Construct a new (non-independent) GeoGebra boolean which is true or
   false according to whether the three given lines are concurrent.

   If you want a snapshot of the value of this GeoGebra boolean as a
   Python ``boolean``, use code like the following:

   .. code-block:: python

      b = AreConcurrent(k1, k2, k3)
      print(b.value)
      # True / False


.. seealso::

   `GeoGebra AreConcurrent() reference
   <https://geogebra.github.io/docs/manual/en/commands/AreConcurrent/>`_
